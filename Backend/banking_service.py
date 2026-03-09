import httpx
import os
from abc import ABC, abstractmethod
from fastapi import HTTPException

# ---------------------------------------------------------------------------
# Configuration for supported banks
# Maps bank_id to environment variable keys for URL and Merchant Account
# ---------------------------------------------------------------------------
BANK_CONFIG = {
    "bank_a": {
        "url_env": "BANK_API_URL_CREDITBANK",
        "account_env": "MERCHANT_ACCOUNT_CREDITBANK",
        "default_url": "http://localhost:8002",
        "default_account": "creditbank_merchant_id",
        "endpoint": "/payments/card"
    },
    "bank_b": {
        "url_env": "BANK_API_URL_CIENSPAY",
        "account_env": "MERCHANT_ACCOUNT_CIENSPAY",
        "default_url": "http://localhost:8003",
        "default_account": "cienspay_merchant_id",
        "endpoint": "/api/transactions/simulate/"
    },
    "bank_c": {
        "url_env": "BANK_API_URL_BANCOBSIDIANA",
        "account_env": "MERCHANT_ACCOUNT_BANCOBSIDIANA",
        "default_url": "http://localhost:8004",
        "default_account": "bancobsidiana_merchant_id",
        "endpoint": "/api/v1/transaction/process"
    }
}

# ---------------------------------------------------------------------------
# BankAdapter – clase base abstracta (Patrón Strategy)
# ---------------------------------------------------------------------------
class BankAdapter(ABC):
    """Interfaz abstracta que todos los adaptadores de banco deben implementar."""

    @abstractmethod
    def build_payload(
        self,
        card_details: dict,
        amount: float,
        merchant_id: str,
        description: str,
    ) -> dict:
        """Construye el cuerpo (payload) específico para la API del banco."""

    @abstractmethod
    def build_headers(self) -> dict:
        """Construye los encabezados HTTP específicos para la API del banco."""

    def parse_response(self, response_json: dict) -> dict:
        """
        Parsea la respuesta de la API del banco.
        La implementación por defecto devuelve la respuesta tal cual;
        cada adaptador puede sobreescribir este método si es necesario.
        """
        return response_json


# ---------------------------------------------------------------------------
# CreditBankAdapter – Bank A
# Payload plano con card_number y merchant_id, headers estándar.
# ---------------------------------------------------------------------------
class CreditBankAdapter(BankAdapter):
    """Adaptador para CreditBank (bank_a)."""

    def build_payload(self, card_details, amount, merchant_id, description):
        return {
            "card_number": card_details.get("card_number"),
            "expiry": card_details.get("expiry"),
            "cvv": card_details.get("cvv"),
            "amount": amount,
            "description": description,
            "merchant_id": merchant_id,
        }

    def build_headers(self):
        return {"Content-Type": "application/json"}


# ---------------------------------------------------------------------------
# CiensPayAdapter – Bank B
# Agrega transaction_type al payload y un token de API en los encabezados.
# ---------------------------------------------------------------------------
class CiensPayAdapter(BankAdapter):
    """Adaptador para CiensPay (bank_b)."""

    def build_payload(self, card_details, amount, merchant_id, description):
        return {
            "card_number": card_details.get("card_number"),
            "expiry": card_details.get("expiry"),
            "cvv": card_details.get("cvv"),
            "amount": amount,
            "description": description,
            "destination_account": merchant_id,
            "transaction_type": "PURCHASE",
        }

    def build_headers(self):
        api_token = os.getenv("CIENSPAY_API_TOKEN", "")
        headers = {"Content-Type": "application/json"}
        if api_token:
            headers["X-API-Token"] = api_token
        return headers


# ---------------------------------------------------------------------------
# BancoObsidianaAdapter – Bank C
# Usa una estructura anidada: {"auth": {...}, "payment": {...}}
# ---------------------------------------------------------------------------
class BancoObsidianaAdapter(BankAdapter):
    """Adaptador para BancoObsidiana (bank_c)."""

    def build_payload(self, card_details, amount, merchant_id, description):
        return {
            "auth": {
                "merchant_key": merchant_id,
                "destination_account": merchant_id,
            },
            "payment": {
                "card": {
                    "number": card_details.get("card_number"),
                    "expiry": card_details.get("expiry"),
                    "cvv": card_details.get("cvv"),
                },
                "amount": amount,
                "description": description,
            },
        }

    def build_headers(self):
        return {"Content-Type": "application/json"}


# ---------------------------------------------------------------------------
# BankFactory – devuelve el adaptador correcto según bank_id
# ---------------------------------------------------------------------------
def BankFactory(bank_id: str) -> BankAdapter:
    """
    Fábrica de adaptadores bancarios.
    Lanza HTTPException 400 si el bank_id no es soportado.
    """
    adapters = {
        "bank_a": CreditBankAdapter,
        "bank_b": CiensPayAdapter,
        "bank_c": BancoObsidianaAdapter,
    }
    if bank_id not in adapters:
        raise HTTPException(status_code=400, detail="Invalid bank selected")
    return adapters[bank_id]()


# ---------------------------------------------------------------------------
# process_bank_payment – función principal (interfaz pública sin cambios)
# ---------------------------------------------------------------------------
async def process_bank_payment(
    card_details: dict,
    amount: float,
    bank_id: str,
    description: str = "Payment for order",
):
    """
    Valida y procesa un pago con la API del banco externo.
    Delega la construcción del payload y los encabezados al adaptador
    específico del banco seleccionado.
    """

    if bank_id not in BANK_CONFIG:
        raise HTTPException(status_code=400, detail="Invalid bank selected")

    config = BANK_CONFIG[bank_id]

    # Obtener configuración desde variables de entorno (obligatorias en producción)
    BANK_API_URL = os.getenv(config["url_env"])
    MERCHANT_ACCOUNT_ID = os.getenv(config["account_env"])

    if not BANK_API_URL:
        print(f"CRITICAL ERROR: Missing environment variable {config['url_env']}")
        raise HTTPException(
            status_code=500,
            detail=f"Server Configuration Error: Bank URL not set for {bank_id}",
        )

    if not MERCHANT_ACCOUNT_ID:
        print(f"CRITICAL ERROR: Missing environment variable {config['account_env']}")
        raise HTTPException(
            status_code=500,
            detail=f"Server Configuration Error: Merchant ID not set for {bank_id}",
        )

    # Obtener el adaptador correcto para este banco
    adapter = BankFactory(bank_id)

    # Construir payload y encabezados específicos del banco
    payload = adapter.build_payload(card_details, amount, MERCHANT_ACCOUNT_ID, description)
    headers = adapter.build_headers()

    print(f"--- Processing payment for {bank_id} ({type(adapter).__name__}) ---")
    print(f"Bank API URL: {BANK_API_URL}")
    print(f"Merchant/Account ID: {MERCHANT_ACCOUNT_ID}")
    print(f"Headers: {headers}")
    print(f"Payload: {payload}")

    try:
        async with httpx.AsyncClient() as client:
            endpoint = config.get("endpoint", "")
            if endpoint and BANK_API_URL.endswith("/"):
                full_url = BANK_API_URL[:-1] + endpoint
            elif endpoint:
                full_url = BANK_API_URL + endpoint
            else:
                full_url = BANK_API_URL

            print(f"Sending POST to: {full_url}")

            response = await client.post(full_url, json=payload, headers=headers, timeout=15.0)

            print(f"Bank Response Status Code: {response.status_code}")
            print(f"Bank Response Body: {response.text}")

            # Lanza excepción para códigos 4xx o 5xx
            response.raise_for_status()

            # Parsear y devolver la respuesta usando el adaptador
            return adapter.parse_response(response.json())

    except httpx.HTTPStatusError as e:
        error_detail = "Payment failed"
        try:
            error_content = e.response.json()
            if "detail" in error_content:
                error_detail = error_content["detail"]
            elif "message" in error_content:
                error_detail = error_content["message"]
        except Exception:
            error_detail = e.response.text or str(e)

        print(f"Bank API Error: {e.response.status_code} - {error_detail}")
        raise HTTPException(status_code=400, detail=f"Bank rejection: {error_detail}")

    except httpx.RequestError as e:
        print(f"Bank Connection Error: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Could not connect to Bank API. Is the bank server online?",
        )

    except Exception as e:
        print(f"Payment Processing Error Traceback: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal payment processing error")
