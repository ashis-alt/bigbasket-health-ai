#  BigBasket Health AI: Autonomous Food-as-Medicine Pipeline

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)





## The Problem & The Gap
The consumer healthcare and nutritional fulfillment journeys are highly fragmented. When a patient receives a diagnostic blood test, they are handed complex medical data indicating deficiencies (e.g., low Vitamin D). However, patients lack the clinical knowledge to translate those deficiencies into a precise, safe grocery list. 

There is a massive disconnect between diagnostic data and e-commerce supply chains. Users are left to blindly search the internet for dietary advice often missing critical contraindications and manually search for items on grocery apps.

## The Solution
**BigBasket Health AI** is an autonomous, clinical-grade "Food as Medicine" pipeline. It bridges the gap between raw diagnostics and immediate grocery fulfillment. 

A user uploads a raw PDF of their lab report. The system autonomously extracts the medical data, generates a clinically safe dietary strategy, cross-references it with a live local grocery inventory, and outputs a fully priced, medically justified shopping cart. Furthermore, it acts as an AI Chef, generating custom cooking recipes using *only* the specific items it just placed in the user's cart.

---

##  System Architecture

```mermaid
flowchart TB
    %% Visual Styling (High-Tech Blueprint)
    classDef ui fill:#0f172a,stroke:#0ea5e9,stroke-width:2px,color:#f8fafc
    classDef api fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#f8fafc
    classDef agent fill:#022c22,stroke:#10b981,stroke-width:2px,color:#f8fafc
    classDef db fill:#451a03,stroke:#f59e0b,stroke-width:2px,color:#f8fafc
    classDef cluster fill:#020617,stroke:#334155,stroke-width:2px,color:#94a3b8,stroke-dasharray: 5 5

    %% Main Tiers
    Frontend[" React / Vite Frontend"]:::ui
    Backend[" FastAPI Orchestrator"]:::api
    Database[(" SQLite Inventory DB")]:::db

    %% AI Subgraph
    subgraph AI_Cluster[" Gemini 2.5 Multi-Agent Pipeline"]
        direction LR
        A1["Agent 1<br/>Medical Extractor"]:::agent
        A2["Agent 2<br/>Clinical Dietitian"]:::agent
        A3["Agent 3<br/>Shopper & Chef"]:::agent

        A1 -->|"Biomarker JSON"| A2
        A2 -->|"Dietary Plan JSON"| A3
    end
    class AI_Cluster cluster

    %% Routing Data Flow
    Frontend -->|"1. Uploads PDF Report"| Backend
    Backend -->|"2. Passes Raw PDF Data"| A1
    
    A3 <-->|"3. Live Inventory Check"| Database
    A3 -->|"4. Priced Cart & Recipes JSON"| Backend
    
    Backend -->|"5. Delivers Final Structured Payload"| Frontend
```
The 3-Agent Hierarchical Workflow
Agent 1 (Multimodal Medical Extractor): Ingests the raw PDF/Image of the blood report. Extracts every biomarker, exact value, unit, and reference range, flagging critical anomalies.

Agent 2 (Clinical Dietitian): Analyzes the JSON output to formulate a targeted dietary strategy, strictly applying Dynamic Contraindication Checks to ensure recommended foods do not trigger other underlying high/low markers.

Agent 3 (Personal Health Shopper & Chef): Queries the local SQLite database for real, in-stock groceries. Maps clinical needs to specific products, sets quantities, calculates the total cart price, and writes custom step-by-step recipes utilizing ONLY the cart inventory.

 Technology Stack
Frontend: React, Vite, Tailwind CSS, Axios, Lucide-React

Backend: Python, FastAPI, Uvicorn

Database: SQLite & SQLAlchemy

AI Engine: Google GenAI SDK (gemini-2.5-flash)

Data Validation: Pydantic (Strict JSON Schema Enforcement)

Running the Project Locally
Prerequisites
Python 3.9+

Node.js & npm

A Google Gemini API Key

1. Backend Setup
Navigate to the root directory and create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Environment Variables:
Create a .env file in the root directory and add your API key:
```env
GEMINI_API_KEY="your_api_key_here"
```

Initialize Database & Start Server:
```bash

Seed the virtual BigBasket warehouse
python -m backend.seed_db

Start the FastAPI server
uvicorn backend.main:app --reload
```


2. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
