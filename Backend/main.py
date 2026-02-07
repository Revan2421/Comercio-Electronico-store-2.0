from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import crud, models, schemas, auth, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS configuration
import os
raw_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
allowed_origins = []
for o in raw_origins:
    o = o.strip()
    if o:
        allowed_origins.append(o)
        if o.endswith("/"):
            allowed_origins.append(o[:-1])
        else:
            allowed_origins.append(o + "/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if "*" not in raw_origins else ["*"],
    allow_credentials=True if "*" not in raw_origins else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "TechShop API is running"}

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth Routes
@app.post("/auth/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db=db, user=user)
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=schemas.User)
def read_user_me(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
    email: str = payload.get("sub")
    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/auth/me", response_model=schemas.User)
def update_user_me(user_update: schemas.UserUpdate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
    email: str = payload.get("sub")
    db_user = crud.get_user_by_email(db, email=email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user(db, db_user, user_update)

@app.get("/auth/me/activity", response_model=schemas.UserActivity)
def read_user_activity(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
    email: str = payload.get("sub")
    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    orders = crud.get_user_orders(db, user_id=user.id)
    return {
        "total_orders": len(orders),
        "last_order_date": orders[0].created_at if orders else None,
        "account_created": datetime.min # Placeholder if we don't have created_at in User
    }

@app.get("/orders/me", response_model=List[schemas.Order])
def read_orders_me(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
    email: str = payload.get("sub")
    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_user_orders(db, user_id=user.id)

# Product Routes
@app.get("/products", response_model=List[schemas.Product])
def read_products(category: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud.get_products(db, skip=skip, limit=limit, category=category)
    return products

@app.post("/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

# Order Routes
@app.post("/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    # Verify user
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user = crud.get_user_by_email(db, email=email)
    if not user:
         raise HTTPException(status_code=401, detail="User not found")

    return crud.create_order(db=db, order=order, user_id=user.id)

# Payment Route
@app.post("/payments", status_code=200)
def process_payment(payment: schemas.PaymentCreate):
    # Mock payment processing
    return {"status": "coming_soon", "message": "Payment gateway integration coming soon", "data": payment}

# Seed Data Endpoint (For development convenience)
@app.post("/seed_products")
def seed_products(db: Session = Depends(get_db)):
    # Clear existing products to ensure clean categories
    db.query(models.Product).delete()
    db.commit()
    
    mock_products = [
        # Laptops & Work (8)
        {"name": "MacBook Pro 16 M3", "price": 2499.99, "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", "description": "Potencia bruta para profesionales", "category": "Laptops & Work"},
        {"name": "Dell XPS 15", "price": 1899.99, "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80", "description": "Elegancia y rendimiento en Windows", "category": "Laptops & Work"},
        {"name": "Monitor LG 27\" 4K", "price": 449.99, "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80", "description": "Claridad absoluta para tu flujo de trabajo", "category": "Laptops & Work"},
        {"name": "Teclado MX Keys S", "price": 109.99, "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80", "description": "Escritura fluida y silenciosa", "category": "Laptops & Work"},
        {"name": "Mouse MX Master 3S", "price": 99.99, "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80", "description": "Ergonomía y precisión infinita", "category": "Laptops & Work"},
        {"name": "Soporte Laptop Aluminio", "price": 39.99, "image": "https://http2.mlstatic.com/D_NQ_NP_2X_806152-MLV86721098667_062025-F.webp", "description": "Eleva tu visión y mejora tu postura", "category": "Laptops & Work"},
        {"name": "Hub USB-C 10 en 1", "price": 59.99, "image": "https://m.media-amazon.com/images/I/71ICRvM7FHL._AC_SY450_.jpg", "description": "Conectividad total para tu escritorio", "category": "Laptops & Work"},
        {"name": "Escritorio Elevable Pro", "price": 599.99, "image": "https://m.media-amazon.com/images/I/61Dm9hwgxWL._AC_SL1500_.jpg", "description": "Trabaja sentado o de pie con estilo", "category": "Laptops & Work"},

        # Mobile Gear (8)
        {"name": "iPhone 15 Pro Max", "price": 1199.99, "image": "https://m.media-amazon.com/images/I/31+hYY59fPL._AC_.jpg", "description": "El titanio llega al smartphone", "category": "Mobile Gear"},
        {"name": "Samsung S24 Ultra", "price": 1299.99, "image": "https://m.media-amazon.com/images/I/41emO6FOHvL._AC_.jpg", "description": "Inteligencia artificial en tu bolsillo", "category": "Mobile Gear"},
        {"name": "iPad Pro M2", "price": 1099.99, "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", "description": "Tu próximo ordenador no es un ordenador", "category": "Mobile Gear"},
        {"name": "Apple Watch Ultra 2", "price": 799.99, "image": "https://m.media-amazon.com/images/I/71SKOyjXoUL._AC_SL1500_.jpg", "description": "Resistencia extrema para deportistas", "category": "Mobile Gear"},
        {"name": "Power Bank 20000mAh", "price": 49.99, "image": "https://m.media-amazon.com/images/I/61bKP+e2KcL._AC_SL1000_.jpg", "description": "Energía infinita para tus viajes", "category": "Mobile Gear"},
        {"name": "Funda Cuero MagSafe", "price": 59.99, "image": "https://m.media-amazon.com/images/I/815KdHw4t+L._AC_SL1500_.jpg", "description": "Protección premium con estilo", "category": "Mobile Gear"},
        {"name": "Gimbal para móvil 6", "price": 159.99, "image": "https://m.media-amazon.com/images/I/71oz-yAKXlL._AC_SL1500_.jpg", "description": "Estabilización profesional para tus videos", "category": "Mobile Gear"},
        {"name": "Targus Mochila Tech", "price": 89.99, "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80", "description": "Transporta tu tecnología con seguridad", "category": "Mobile Gear"},

        # Premium Audio (8)
        {"name": "Sony WH-1000XM5", "price": 349.99, "image": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80", "description": "La mejor cancelación de ruido del mundo", "category": "Premium Audio"},
        {"name": "AirPods Max", "price": 549.99, "image": "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=800&q=80", "description": "Sonido de alta fidelidad absoluto", "category": "Premium Audio"},
        {"name": "Bose QuietComfort Ultra", "price": 429.99, "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80", "description": "Inmersión total en tu música", "category": "Premium Audio"},
        {"name": "Sony WF-1000XM5 (In-Ear)", "price": 279.99, "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", "description": "Sonido increíble en formato mini", "category": "Premium Audio"},
        {"name": "Marshall Stanmore III", "price": 379.99, "image": "https://m.media-amazon.com/images/I/91QUv-fj6wL._AC_SL1500_.jpg", "description": "Estilo icónico y sonido potente", "category": "Premium Audio"},
        {"name": "Sennheiser HD 660S2", "price": 599.99, "image": "https://m.media-amazon.com/images/I/81xpWUthgjL._AC_SL1500_.jpg", "description": "Para audiófilos sin compromisos", "category": "Premium Audio"},
        {"name": "Soundbar Sonos Beam", "price": 499.99, "image": "https://m.media-amazon.com/images/I/51kIR1gKWYL._AC_SL1500_.jpg", "description": "Cine en casa compacto e inteligente", "category": "Premium Audio"},
        {"name": "Micrófono Shure SM7B", "price": 399.99, "image": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80", "description": "El estándar de la industria del podcasting", "category": "Premium Audio"},

        # Ultimate Gaming (8)
        {"name": "RTX 4090 Founders Edition", "price": 1599.99, "image": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80", "description": "La cúspide del rendimiento gaming", "category": "Ultimate Gaming"},
        {"name": "Razer BlackWidow V4", "price": 229.99, "image": "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=80", "description": "Inmersión total con RGB", "category": "Ultimate Gaming"},
        {"name": "Logitech G Pro X Superlight", "price": 159.99, "image": "https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?auto=format&fit=crop&w=800&q=80", "description": "El ratón más ligero de los eSports", "category": "Ultimate Gaming"},
        {"name": "Monitor Samsung Odyssey G9", "price": 1299.99, "image": "https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=800&q=80", "description": "49 pulgadas de pura adrenalina", "category": "Ultimate Gaming"},
        {"name": "Auriculares SteelSeries Arctis", "price": 349.99, "image": "https://m.media-amazon.com/images/I/61+WSjGgFzL._AC_SL1500_.jpg", "description": "Sonido envolvente para ganar", "category": "Ultimate Gaming"},
        {"name": "Silla Herman Miller Embody", "price": 1799.99, "image": "https://m.media-amazon.com/images/I/81vXeRdDeNL._AC_SY300_SX300_QL70_FMwebp_.jpg", "description": "Ergonomía extrema para sesiones largas", "category": "Ultimate Gaming"},
        {"name": "Consola PlayStation 5 Slim", "price": 499.99, "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80", "description": "El futuro del gaming ya está aquí", "category": "Ultimate Gaming"},
        {"name": "Mando Xbox Elite Series 2", "price": 179.99, "image": "https://m.media-amazon.com/images/I/717XTm0moDL._SL1500_.jpg", "description": "El mando definitivo para ganar", "category": "Ultimate Gaming"}
    ]

    for p in mock_products:
        crud.create_product(db, schemas.ProductCreate(**p))
    
    return {"message": "Data seeded successfully"}
