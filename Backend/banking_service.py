import httpx
import os
from fastapi import HTTPException

# Configuration for supported banks
# Maps bank_id to environment variable keys for URL and Merchant Account
BANK_CONFIG = {
    "bank_a": {
        "url_env": "BANK_API_URL_CREDITBANK",
        "account_env": "MERCHANT_ACCOUNT_CREDITBANK",
        "default_url": "http://localhost:8002",
        "default_account": "creditbank_merchant_id"
    },
    "bank_b": {
        "url_env": "BANK_API_URL_CIENSPAY",
        "account_env": "MERCHANT_ACCOUNT_CIENSPAY",
        "default_url": "http://localhost:8003",
        "default_account": "cienspay_merchant_id"
    },
    "bank_c": {
        "url_env": "BANK_API_URL_BANCOBSIDIANA",
        "account_env": "MERCHANT_ACCOUNT_BANCOBSIDIANA",
        "default_url": "http://localhost:8004",
        "default_account": "bancobsidiana_merchant_id"
    }
}

async def process_bank_payment(card_details: dict, amount: float,  bank_id: str, description: str = "Payment for order"):
    """
    Validates and processes payment with the external Bank API.
    """
    
    if bank_id not in BANK_CONFIG:
        raise HTTPException(status_code=400, detail="Invalid bank selected")

    config = BANK_CONFIG[bank_id]
    
    # Get configuration from environment variables with fallbacks
    BANK_API_URL = os.getenv(config["url_env"], config["default_url"])
    MERCHANT_ACCOUNT_ID = os.getenv(config["account_env"], config["default_account"])

    if not BANK_API_URL:
        raise HTTPException(status_code=500, detail=f"Configuration error: Missing API URL for {bank_id}")

    # Construct the payload for the Bank API
    # Endpoint: POST /payments/card
    payload = {
        "card_number": card_details.get("card_number"),
        "expiry": card_details.get("expiry"),
        "cvv": card_details.get("cvv"),
        "amount": amount,
        "description": description,
        "destination_account": MERCHANT_ACCOUNT_ID,
        "merchant_id": MERCHANT_ACCOUNT_ID # Some APIs might expect one or the other
    }

    print(f"Processing payment for {bank_id} at {BANK_API_URL} with merchant {MERCHANT_ACCOUNT_ID}")

    try:
        async with httpx.AsyncClient() as client:
            # We assume the external API expects the payload at /payments/card
            # Adjust the URL schema if the user's mock server is different
            response = await client.post(f"{BANK_API_URL}/payments/card", json=payload, timeout=10.0)

            # Raise for status code 4xx or 5xx
            response.raise_for_status()

            # If successful, return the response data
            return response.json()

    except httpx.HTTPStatusError as e:
        # Handle specific error responses from the bank
        error_detail = "Payment failed"
        try:
            error_content = e.response.json()
            if "detail" in error_content:
                error_detail = error_content["detail"]
        except:
            pass
        
        print(f"Bank API Error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=400, detail=f"Bank rejection: {error_detail}")

    except httpx.RequestError as e:
        # Handle connection errors
        print(f"Bank Connection Error: {str(e)}")
        # For development/university project, give a more helpful error
        raise HTTPException(status_code=503, detail=f"Could not connect to Bank API at {BANK_API_URL}. Is the bank server running?")
    except Exception as e:
        print(f"Payment Processing Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal payment processing error")
