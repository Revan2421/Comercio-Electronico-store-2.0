import asyncio
import httpx
import os
from dotenv import load_dotenv
import sys

# Añadir el path de librerías instaladas por el usuario
user_site = os.path.join(os.environ['APPDATA'], 'Python', 'Python314', 'site-packages')
sys.path.append(user_site)

# Añadir la ruta del backend al path para poder importar banking_service
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import banking_service

async def test_connection():
    load_dotenv()
    print("Probando conexión con el banco...")
    
    # Datos de prueba (Usa una tarjeta de prueba DIFERENTE a la cuenta de destino)
    card_details = {
        "card_number": "1234567812345678", # Tarjeta "Cliente"
        "expiry": "12/28",
        "cvv": "123"
    }
    
    try:
        # Intentamos procesar un pago de $1.00 al banco_a (CreditBank)
        result = await banking_service.process_bank_payment(
            card_details=card_details,
            amount=1.00,
            bank_id="bank_a",
            description="Test connection from TecShop"
        )
        print("✅ Conexión exitosa:")
        print(result)
    except Exception as e:
        print("❌ Error en la conexión:")
        print(str(e))

if __name__ == "__main__":
    asyncio.run(test_connection())
