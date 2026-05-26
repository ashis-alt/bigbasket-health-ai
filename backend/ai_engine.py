import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from backend.schemas import LabReportExtraction

# Load the .env file
load_dotenv()

# Explicitly grab the key from the environment
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("CRITICAL: Cannot find GEMINI_API_KEY. Please ensure your .env file is saved and contains the key.")

client = genai.Client(api_key=api_key)

def extract_lab_report_data(file_bytes: bytes, mime_type: str) -> LabReportExtraction:
    # Extract the Pydantic schema as a string to feed into the prompt
    schema_json = LabReportExtraction.model_json_schema()
    
    prompt = f"""
    Analyze this medical lab report. Extract all patient details, and every single biomarker tested. 
    Capture the exact value, unit, and reference range. 
    Strictly classify the status as LOW, NORMAL, or HIGH.
    If a value is severely out of range and requires immediate medical attention, add its name to critical_flags.
    
    You MUST return ONLY a valid JSON object that strictly adheres to the following JSON schema:
    {schema_json}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
            types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
            prompt
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.0  # Zero creativity for absolute clinical precision
        )
    )
    
    return LabReportExtraction.model_validate_json(response.text)