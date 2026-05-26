from google.genai import types
from backend.schemas import LabReportExtraction, DietaryPlan
from backend.ai_engine import client

def generate_dynamic_dietary_plan(report: LabReportExtraction) -> DietaryPlan:
    report_json = report.model_dump_json()
    
    # Extract the Pydantic schema as a string
    schema_json = DietaryPlan.model_json_schema()
    
    prompt = f"""
    You are an expert clinical dietitian AI. Review the following extracted lab report data:
    {report_json}
    
    Your task is to generate a safe, highly accurate dietary regimen.
    1. Identify all biomarkers with a status of 'LOW' or 'HIGH'.
    2. For each 'LOW' marker, recommend foods to increase its level.
    3. For each 'HIGH' marker, recommend foods to decrease its level.
    4. CRITICAL CONTRAINDICATION CHECK: Cross-reference all markers. If recommending a food for one deficiency actively worsens another 'HIGH' or 'LOW' marker (e.g., spinach for iron but the user has high uric acid), you MUST exclude it and add it to the restricted_nutrients list.
    
    Ensure the reasoning clearly explains the contraindication if one exists.
    
    You MUST return ONLY a valid JSON object that strictly adheres to the following JSON schema:
    {schema_json}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.1  # Very low temperature for clinical safety
        )
    )
    
    return DietaryPlan.model_validate_json(response.text)