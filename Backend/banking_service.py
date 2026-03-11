import httpx
import os
from fastapi import HTTPException
from abc import ABC, abstractmethod

# Configuration for supported banks
BANK_CONFIG = {
    "bank_a": {
        "url_env": "BANK_API_URL_CREDITBANK",
        "account_env": "MERCHANT_ACCOUNT_CREDITBANK",
        "default_url": "http://localhost:8002",
        "default_account": "creditbank_merchant_id",
        "endpoint": "/payments/card",
        "adapter": "legacy"
    },
    "bank_b": {
        "url_env": "BANK_API_URL_CIENSPAY",
        "account_env": "MERCHANT_ACCOUNT_CIENSPAY",
        "identifier_name": "cienspay",
        "endpoint": "/api/transactions/simulate/",
        "adapter": "cienspay"
    },
    "bank_c": {
        "url_env": "BANK_API_URL_BANCOBSIDIANA",
        "account_env": "MERCHANT_ACCOUNT_BANCOBSIDIANA",
        "default_url": "http://localhost:8004",
        "default_account": "bancobsidiana_merchant_id",
        "endpoint": "/api/v1/transaction/process",
        "adapter": "legacy"
    }
}

class BankAdapter(ABC):
    @abstractmethod
    async def process_payment(self, card_details: dict, amount: float, description: str, bank_id: str, config: dict) -> dict:
        pass

class GenericBankAdapter(BankAdapter):
    """
    Adapter for APIs following the standard university project format (like CiensPay).
    """
    async def process_payment(self, card_details: dict, amount: float, description: str, bank_id: str, config: dict) -> dict:
        BANK_API_URL = os.getenv(config["url_env"])

        if not BANK_API_URL:
            # Check for missing URL env variable
            print(f"CRITICAL ERROR: Missing environment variable {config['url_env']}")
            raise HTTPException(status_code=500, detail=f"Server Configuration Error: Bank URL not set for {bank_id}")

        identifier_name = config.get("identifier_name", "cienspay")
        
        # Standard payload according to the PDF documentation
        payload = {
            "button_bank_external": False,
            "bank_identifier": identifier_name,
            "card_number": str(card_details.get("card_number", "")).replace(" ", ""),
            "expiry_date": card_details.get("expiry"),
            "cvv": str(card_details.get("cvv", "")),
            "amount": str(amount),
            "description": description
        }

        print(f"--- Processing payment for {bank_id} ({identifier_name}) ---")
        print(f"Bank API URL: {BANK_API_URL}")
        print(f"Payload: {payload}")

        return await self._send_request(BANK_API_URL, config.get("endpoint", ""), payload)

    async def _send_request(self, base_url: str, endpoint: str, payload: dict) -> dict:
        try:
            async with httpx.AsyncClient() as client:
                if endpoint and base_url.endswith('/'):
                    full_url = base_url[:-1] + endpoint
                elif endpoint:
                    full_url = base_url + endpoint
                else:
                    full_url = base_url

                print(f"Sending POST to: {full_url}")
                
                response = await client.post(full_url, json=payload, timeout=15.0)

                print(f"Bank Response Status Code: {response.status_code}")
                print(f"Bank Response Body: {response.text}")

                response.raise_for_status()
                return response.json()

        except httpx.HTTPStatusError as e:
            error_detail = "Payment failed"
            try:
                error_content = e.response.json()
                if "detail" in error_content:
                    error_detail = error_content["detail"]
                elif "message" in error_content:
                    error_detail = error_content["message"]
                elif "error" in error_content:
                    error_detail = error_content["error"]
            except:
                error_detail = e.response.text or str(e)
            
            print(f"Bank API Error: {e.response.status_code} - {error_detail}")
            raise HTTPException(status_code=400, detail=f"Bank rejection: {error_detail}")

        except httpx.RequestError as e:
            print(f"Bank Connection Error: {str(e)}")
            raise HTTPException(status_code=503, detail=f"Could not connect to Bank API. Is the bank server online?")
        except Exception as e:
            print(f"Payment Processing Error Traceback: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal payment processing error")

class LegacyBankAdapter(GenericBankAdapter):
    """
    Adapter for APIs that still use the old property names
    """
    async def process_payment(self, card_details: dict, amount: float, description: str, bank_id: str, config: dict) -> dict:
        BANK_API_URL = os.getenv(config["url_env"])
        MERCHANT_ACCOUNT_ID = os.getenv(config["account_env"])

        if not BANK_API_URL:
             raise HTTPException(status_code=500, detail=f"Server Configuration Error: Bank URL not set for {bank_id}")

        # Legacy payload we used to send
        payload = {
            "card_number": str(card_details.get("card_number", "")).replace(" ", ""),
            "expiry": card_details.get("expiry"),
            "cvv": str(card_details.get("cvv", "")),
            "amount": amount,
            "description": description,
            "destination_account": MERCHANT_ACCOUNT_ID,
            "merchant_id": MERCHANT_ACCOUNT_ID 
        }

        print(f"--- Processing legacy payment for {bank_id} ---")
        print(f"Bank API URL: {BANK_API_URL}")
        print(f"Payload: {payload}")

        return await self._send_request(BANK_API_URL, config.get("endpoint", ""), payload)


# Factory to get the right adapter
def get_bank_adapter(adapter_type: str) -> BankAdapter:
    if adapter_type == "cienspay":
        return GenericBankAdapter()
    else:
        return LegacyBankAdapter()

async def process_bank_payment(card_details: dict, amount: float,  bank_id: str, description: str = "Payment for order"):
    """
    Validates and processes payment with the external Bank API.
    """
    if bank_id not in BANK_CONFIG:
        raise HTTPException(status_code=400, detail="Invalid bank selected")

    config = BANK_CONFIG[bank_id]
    adapter = get_bank_adapter(config.get("adapter", "generic"))
    
    return await adapter.process_payment(card_details, amount, description, bank_id, config)
