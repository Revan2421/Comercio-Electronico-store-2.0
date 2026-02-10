
from sqlalchemy.orm import Session
import models, schemas, auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, name=user.name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_products(db: Session, skip: int = 0, limit: int = 100, category: str = None):
    query = db.query(models.Product)
    if category:
        query = query.filter(models.Product.category == category)
    return query.offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def create_order(db: Session, order: schemas.OrderCreate, user_id: int):
    # Calculate total price
    total_price = 0
    db_order_items = []
    
    # First create the order object
    db_order = models.Order(user_id=user_id, total_price=0, status="pending")
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product:
            item_price = product.price
            total_price += item_price * item.quantity
            db_item = models.OrderItem(order_id=db_order.id, product_id=item.product_id, quantity=item.quantity, price=item_price)
            db.add(db_item)
    
    db_order.total_price = total_price
    db.commit()
    db.refresh(db_order)
    return db_order

def update_user(db: Session, db_user: models.User, user_update: schemas.UserUpdate):
    if user_update.name:
        db_user.name = user_update.name
    if user_update.email:
        db_user.email = user_update.email
    if user_update.password:
        db_user.hashed_password = auth.get_password_hash(user_update.password)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_orders(db: Session, user_id: int):
    return db.query(models.Order).filter(models.Order.user_id == user_id).order_by(models.Order.created_at.desc()).all()

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def create_payment(db: Session, payment: schemas.PaymentCreate, status: str = "success", provider: str = "manual"):
    db_payment = models.Payment(
        order_id=payment.order_id,
        amount=payment.amount,
        status=status,
        provider=provider
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment
