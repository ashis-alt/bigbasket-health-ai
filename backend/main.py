from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from backend.database import get_db, engine, Base
from backend.models import Product
from backend.ai_engine import extract_lab_report_data
from backend.dietary_engine import generate_dynamic_dietary_plan
from backend.cart_engine import generate_smart_cart

# Load environment variables from .env file
load_dotenv()

# Generates bigbasket_sim.db automatically in your root folder
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BigBasket Health AI",
    description="Automated Lab Report Analysis & Dietary Cart Generation"
)

# --- ADDED: CORS Middleware to allow React to talk to FastAPI ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def health_check():
    return {
        "status": "System Online",
        "message": "FastAPI server is running. Ready for Lab Report Ingestion."
    }

@app.post("/upload-report/")
async def upload_lab_report(file: UploadFile = File(...), db: Session = Depends(get_db)):
    valid_mime_types = ["application/pdf", "image/jpeg", "image/png"]
    if file.content_type not in valid_mime_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF, JPG, or PNG.")
    
    try:
        # Step 1: Agent 1 parses the PDF/Image into structured data
        file_bytes = await file.read()
        extracted_data = extract_lab_report_data(file_bytes, file.content_type)
        
        # Step 2: Agent 2 generates the dynamic, contraindication-safe dietary plan
        dietary_plan = generate_dynamic_dietary_plan(extracted_data)
        
        # Step 3: Agent 3 cross-references the plan with local DB and builds the cart
        shopping_cart = generate_smart_cart(dietary_plan, db)
        
        return {
            "message": "Full Health-to-Cart Pipeline Complete.",
            "report_data": extracted_data,
            "dietary_plan": dietary_plan,
            "shopping_cart": shopping_cart
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Pipeline failed: {str(e)}")