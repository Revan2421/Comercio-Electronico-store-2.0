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
        "default_account": "1847192847",
        "endpoint": "/payments/card",
        "adapter": "creditbank"
    },
    "bank_b": {
        "url_env": "BANK_API_URL_CIENSPAY",
        "account_env": "MERCHANT_ACCOUNT_CIENSPAY",
        "endpoint": "/api/transactions/simulate/",
        "adapter": "cienspay"
    },
    "bank_c": {
        "url_env": "BANK_API_URL_BANCOBSIDIANA",
        "account_env": "MERCHANT_ACCOUNT_BANCOBSIDIANA",
        "default_url": "http://localhost:8004",
        "default_account": "ciens-mart",
        "endpoint": "/api/v1/transaction/process",
        "adapter": "bancobsidiana"
    }
}

class BankAdapter(ABC):
    @abstractmethod
    async def process_payment(self, card_details: dict, amount: float, description: str, bank_id: str, config: dict) -> dict:
        pass

    async def _send_request(self, base_url: str, endpoint: str, payload: dict, headers: dict = None) -> dict:
        try:
            async with httpx.AsyncClient() as client:
                if endpoint and base_url.endswith('/'):
                    full_url = base_url[:-1] + endpoint
                elif endpoint:
                    full_url = base_url + endpoint
                else:
                    full_url = base_url

                print(f"Sending POST to: {full_url}")
                req_headers = headers or {"Content-Type": "application/json"}
                response = await client.post(full_url, json=payload, headers=req_headers, timeout=15.0)

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


class CreditBankAdapter(BankAdapter):
    """Adapter for bank a (CreditBank)"""
    async def process_payment(self, card_details: dict, amount: float, description: str, bank_id: str, config: dict) -> dict:
        BANK_API_URL = os.getenv(config["url_env"], config.get("default_url"))
        MERCHANT_ACCOUNT_ID = os.getenv(config["account_env"], config.get("default_account", "1847192847"))
        
        if not BANK_API_URL:
            raise HTTPException(status_code=500, detail=f"Server Configuration Error: Bank URL not set for {bank_id}")

        # JSON exacto para CreditBank (banco a)
        payload = {
            "card_number": str(card_details.get("card_number", "")),
            "expiry": card_details.get("expiry"),
            "cvv": str(card_details.get("cvv", "")),
            "amount": float(amount),
            "description": description,
            "destination_account": MERCHANT_ACCOUNT_ID,
            "bank_identifier": "creditbank" 
        }

        print(f"--- Processing payment for CreditBank ---")
        print(f"Bank API URL: {BANK_API_URL}")
        print(f"Payload: {payload}")
        return await self._send_request(BANK_API_URL, config.get("endpoint", ""), payload)


class CiensPayAdapter(BankAdapter):
    """Adapter for bank b (CiensPay)"""
    async def process_payment(self, card_details: dict, amount: float, description: str, bank_id: str, config: dict) -> dict:
        BANK_API_URL = os.getenv(config["url_env"])
        if not BANK_API_URL:
            raise HTTPException(status_code=500, detail=f"Server Configuration Error: Bank URL not set for {bank_id}")

        # JSON exacto para CiensPay (banco b)
        payload = {
            "button_bank_external": False,
            "bank_identifier": "cienspay",
            "card_number": str(card_details.get("card_number", "")),
            "expiry_date": card_details.get("expiry"),
            "cvv": str(card_details.get("cvv", "")),
            "amount": str(amount),
            "description": description
        }

        print(f"--- Processing payment for CiensPay ---")
        print(f"Bank API URL: {BANK_API_URL}")
        print(f"Payload: {payload}")
        
        headers = {"Content-Type": "application/json"}
        # Agregar el token si está disponible
        api_token = os.getenv("CIENSPAY_API_TOKEN")
        if api_token:
            headers["X-API-Token"] = api_token
            
        return await self._send_request(BANK_API_URL, config.get("endpoint", ""), payload, headers=headers)


class BancoObsidianaAdapter(BankAdapter):
    """Adapter for bank c (BancoObsidiana)"""
    async def process_payment(self, card_details: dict, amount: float, description: str, bank_id: str, config: dict) -> dict:
        BANK_API_URL = os.getenv(config["url_env"], config.get("default_url"))
        MERCHANT_ACCOUNT_ID = os.getenv(config["account_env"], config.get("default_account", "ciens-mart"))

        if not BANK_API_URL:
            raise HTTPException(status_code=500, detail=f"Server Configuration Error: Bank URL not set for {bank_id}")

        # JSON exacto para BancoObsidiana (banco c)
        payload = {
            "card_number": str(card_details.get("card_number", "")),
            "expiry": card_details.get("expiry"),
            "cvv": str(card_details.get("cvv", "")),
            "amount": float(amount),
            "merchant_id": MERCHANT_ACCOUNT_ID,
            "description": description 
        }

        print(f"--- Processing payment for BancoObsidiana ---")
        print(f"Bank API URL: {BANK_API_URL}")
        print(f"Payload: {payload}")
        return await self._send_request(BANK_API_URL, config.get("endpoint", ""), payload)


# Factory to get the right adapter
def get_bank_adapter(adapter_type: str) -> BankAdapter:
    if adapter_type == "cienspay":
        return CiensPayAdapter()
    elif adapter_type == "creditbank":
        return CreditBankAdapter()
    elif adapter_type == "bancobsidiana":
        return BancoObsidianaAdapter()
    else:
        raise ValueError(f"Unknown adapter type: {adapter_type}")

async def process_bank_payment(card_details: dict, amount: float,  bank_id: str, description: str = "Payment for order"):
    """
    Validates and processes payment with the external Bank API.
    """
    if bank_id not in BANK_CONFIG:
        raise HTTPException(status_code=400, detail="Invalid bank selected")

    config = BANK_CONFIG[bank_id]
    adapter = get_bank_adapter(config.get("adapter", "generic"))
    
    return await adapter.process_payment(card_details, amount, description, bank_id, config)
