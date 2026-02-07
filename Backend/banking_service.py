import httpx
import os
from fastapi import HTTPException

async def process_bank_payment(card_details: dict, amount: float, description: str = "Payment for order"):
    """
    Validates and processes payment with the external Bank API.
    """
    # Get configuration from environment variables
    BANK_API_URL = os.getenv("BANK_API_URL", "http://localhost:8002")
    MERCHANT_ACCOUNT_ID = os.getenv("MERCHANT_ACCOUNT_ID", "1234567890")

    # Construct the payload for the Bank API
    # Endpoint: POST /payments/card
    payload = {
        "card_number": card_details.get("card_number"),
        "expiry": card_details.get("expiry"),
        "cvv": card_details.get("cvv"),
        "amount": amount,
        "description": description,
        "destination_account": MERCHANT_ACCOUNT_ID
    }

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
        raise HTTPException(status_code=503, detail="Payment service unavailable")
    except Exception as e:
        print(f"Payment Processing Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal payment processing error")
