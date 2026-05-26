from backend.database import SessionLocal, engine, Base
from backend.models import Product

# Ensure tables are created
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    # Check if we already seeded to avoid duplicates
    if db.query(Product).first():
        print("Database already seeded!")
        db.close()
        return

    mock_inventory = [
        # Vitamin D & B12 Rich Foods
        Product(name="Taaza Homogenised Toned Milk", brand="Amul", price=66.0, quantity="1 L", nutrient_tags="Vitamin D, Calcium, Protein"),
        Product(name="Farm Fresh White Eggs", brand="Fresho", price=65.0, quantity="6 pcs", nutrient_tags="Vitamin D, B12, Protein"),
        Product(name="Button Mushrooms", brand="Fresho", price=45.0, quantity="200 g", nutrient_tags="Vitamin D, Antioxidants"),
        Product(name="Pink Salmon Fillet", brand="Licious", price=450.0, quantity="250 g", nutrient_tags="Vitamin D, Omega-3"),
        
        # Immunity & Blood Health (Iron, B12, General)
        Product(name="Fresh Spinach (Palak)", brand="Fresho", price=25.0, quantity="250 g", nutrient_tags="Iron, Vitamin K, Folate"),
        Product(name="Pomegranate", brand="Fresho", price=120.0, quantity="4 pcs", nutrient_tags="Antioxidants, Vitamin C"),
        Product(name="Whole Wheat Bread", brand="Britannia", price=45.0, quantity="400 g", nutrient_tags="Carbs, Fiber"),
        Product(name="Premium Almonds", brand="BB Royal", price=299.0, quantity="250 g", nutrient_tags="Vitamin E, Magnesium")
    ]

    db.add_all(mock_inventory)
    db.commit()
    print("Successfully seeded BigBasket mock inventory!")
    db.close()

if __name__ == "__main__":
    seed_database()