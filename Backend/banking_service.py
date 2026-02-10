import httpx
import os
from fastapi import HTTPException

# Configuration for supported banks
# Maps bank_id to environment variable keys for URL and Merchant Account
BANK_CONFIG = {
    "bank_a": {
        "url_env": "BANK_API_URL_CREDITBANK",
        "account_env": "MERCHANT_ACCOUNT_CREDITBANK",
    },
    "bank_b": {
        "url_env": "BANK_API_URL_CIENSPAY",
        "account_env": "MERCHANT_ACCOUNT_CIENSPAY",
    },
    "bank_c": {
        "url_env": "BANK_API_URL_BANCOBSIDIANA",
        "account_env": "MERCHANT_ACCOUNT_BANCOBSIDIANA",
    }
}

async def process_bank_payment(card_details: dict, amount: float,  bank_id: str, description: str = "Payment for order"):
    """
    Validates and processes payment with the external Bank API.
    """
    
    if bank_id not in BANK_CONFIG:
        raise HTTPException(status_code=400, detail="Invalid bank selected")

    config = BANK_CONFIG[bank_id]
    
   
    BANK_API_URL = os.getenv(config["url_env"])
    MERCHANT_ACCOUNT_ID = os.getenv(config["account_env"])

    if not BANK_API_URL:
        print(f"CRITICAL ERROR: Missing environment variable {config['url_env']}")
        raise HTTPException(status_code=500, detail=f"Server Configuration Error: Bank URL not set for {bank_id}")

    if not MERCHANT_ACCOUNT_ID:
        print(f"CRITICAL ERROR: Missing environment variable {config['account_env']}")
        raise HTTPException(status_code=500, detail=f"Server Configuration Error: Merchant ID not set for {bank_id}")


    payload = {
        "card_number": card_details.get("card_number"),
        "expiry": card_details.get("expiry"),
        "cvv": card_details.get("cvv"),
        "amount": amount,
        "description": description,
        "destination_account": MERCHANT_ACCOUNT_ID,
        "merchant_id": MERCHANT_ACCOUNT_ID 
    }

    print(f"--- Processing payment for {bank_id} ---")
    print(f"Bank API URL: {BANK_API_URL}")
    print(f"Merchant/Account ID: {MERCHANT_ACCOUNT_ID}")
    print(f"Payload: {payload}")

    try:
        async with httpx.AsyncClient() as client:
            endpoint = "/payments/card"
            if BANK_API_URL.endswith('/'):
                full_url = BANK_API_URL[:-1] + endpoint
            else:
                full_url = BANK_API_URL + endpoint

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
