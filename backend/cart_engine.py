from sqlalchemy.orm import Session
from google.genai import types
from backend.models import Product
from backend.schemas import DietaryPlan, ShoppingCart
from backend.ai_engine import client

def generate_smart_cart(dietary_plan: DietaryPlan, db: Session) -> ShoppingCart:
    # 1. Fetch local inventory from SQLite
    inventory = db.query(Product).all()
    inventory_data = [
        {"id": p.id, "name": p.name, "brand": p.brand, "price": p.price, "qty_per_unit": p.quantity, "tags": p.nutrient_tags}
        for p in inventory
    ]
    
    # Extract the Pydantic schema as a string to bypass the SDK bug
    schema_json = ShoppingCart.model_json_schema()
    
    prompt = f"""
    You are an expert Personal Health Shopper and Clinical Chef AI. 
    Here is the user's medically accurate dietary plan:
    {dietary_plan.model_dump_json()}
    
    Here is the current LIVE inventory available in their local BigBasket warehouse:
    {inventory_data}
    
    Your assignment is a two-step process:
    1. BUILD THE CART: Select highly relevant items from the inventory to address the client's deficiencies. Match the 'recommended_nutrients' from the plan to the item 'tags'.
    2. CREATE CART-BASED RECIPES: Review the exact items you chose to put in the shopping cart. Generate 1 or 2 realistic, delicious, health-focused recipes. You MUST ONLY use ingredients that you explicitly placed in the cart items list. Do not introduce foreign ingredients.
    
    CRITICAL FORMATTING INSTRUCTIONS:
    You MUST return ONLY a valid JSON object. 
    Ensure ALL keys and string values are enclosed in DOUBLE QUOTES ("key"). 
    Do not use single quotes or unquoted keys.
    
    Strictly adhere to this JSON schema:
    {schema_json}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.0 # Zero creativity forces absolute schema adherence
        )
    )
    
    raw_json = response.text.strip()
    if raw_json.startswith('```json'):
        raw_json = raw_json[7:]
    if raw_json.endswith('```'):
        raw_json = raw_json[:-3]
        
    return ShoppingCart.model_validate_json(raw_json.strip())