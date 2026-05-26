from sqlalchemy import Column, Integer, String, Float
from backend.database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    brand = Column(String)
    price = Column(Float)
    quantity = Column(String)  # e.g., "500 ml", "1 kg", "6 pcs"
    nutrient_tags = Column(String)  # e.g., "Vitamin D, B12, Calcium"
    in_stock = Column(Integer, default=100)