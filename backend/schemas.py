from pydantic import BaseModel, Field
from typing import List, Optional

class Biomarker(BaseModel):
    name: str = Field(description="Exact name of the biomarker, e.g., Vitamin B12")
    value: float = Field(description="Numerical value extracted")
    unit: str = Field(description="Unit of measurement, e.g., pg/mL")
    reference_range: str = Field(description="Normal reference range provided")
    status: str = Field(description="Strictly classify as: LOW, NORMAL, or HIGH")

class LabReportExtraction(BaseModel):
    patient_name: Optional[str] = Field(description="Name if visible, otherwise null")
    report_date: Optional[str] = Field(description="Date if visible, otherwise null")
    biomarkers: List[Biomarker] = Field(description="All extracted biomarkers")
    critical_flags: List[str] = Field(description="Biomarkers severely out of range")

class DietaryRecommendation(BaseModel):
    target_biomarker: str
    action: str = Field(description="E.g., Increase Intake, Decrease Intake")
    recommended_nutrients: List[str] = Field(description="List of foods to consume")
    restricted_nutrients: List[str] = Field(description="List of foods to strictly avoid due to contraindications")
    reasoning: str = Field(description="Brief medical explanation for this recommendation and restriction")

class DietaryPlan(BaseModel):
    recommendations: List[DietaryRecommendation]

class CartItem(BaseModel):
    product_id: int = Field(description="The ID of the product from the database")
    name: str = Field(description="Product name")
    brand: str = Field(description="Product brand")
    price: float = Field(description="Price per unit")
    buy_quantity: int = Field(description="How many units the user should buy")
    justification: str = Field(description="Medical reasoning for adding this specific item to the cart")

# --- NEW: Recipe Schema Added ---
class Recipe(BaseModel):
    title: str = Field(description="A creative, appetizing name for the recipe, e.g., 'Immunity-Boosting Spinach Mushroom Stir-Fry'")
    prep_time: str = Field(description="Estimated preparation and cooking time, e.g., '15 mins'")
    ingredients_used: List[str] = Field(description="List of exact product names from the cart used in this recipe")
    steps: List[str] = Field(description="Step-by-step simple cooking instructions")
    health_benefit_summary: str = Field(description="Explains how eating this specific meal fixes the patient's deficiencies")

class ShoppingCart(BaseModel):
    items: List[CartItem] = Field(description="List of groceries to buy")
    recipes: List[Recipe] = Field(description="1 or 2 curated recipes created using ONLY the chosen items in the items list")
    total_estimated_price: float = Field(description="Total cost of the cart")