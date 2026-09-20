"""
Yield Signal — Weather-to-Yield API
Connected to Gemini 2.5 Flash using the File API for data analysis.
"""

import os
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

# ==========================================
# GEMINI AI SETUP & INITIALIZATION
# ==========================================

# 1. Configure the API Key from the environment
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# 2. Upload the file once when the server starts
print("Starting server and uploading dataset to Gemini...")
FILE_PATH = "/Users/zeenzcg/Documents/project/yield_prediction/backend/Main_DataBricks_Hackathon_Notebook.csv"

try:
    sample_file = genai.upload_file(path=FILE_PATH, display_name="Crop Yield Dataset")
    print(f"Successfully uploaded '{sample_file.display_name}' as: {sample_file.uri}")
except Exception as e:
    print(f"WARNING: Failed to upload file to Gemini. Error: {e}")
    sample_file = None

# 3. Create the System Prompt (Instructions for the AI)
system_instruction = """
You are an expert agricultural data analyst for Corteva. 
You have been provided with a dataset containing crop yields, temperatures, and years.
Whenever the user asks a question, carefully consult the attached dataset to provide factual, accurate answers. 
Explain your reasoning clearly. If the data does not contain the answer, say "I don't have enough data to answer that."
"""

# 4. Initialize the Model
gemini_model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=system_instruction
)

# ==========================================
# FASTAPI APP SETUP
# ==========================================

app = FastAPI(
    title="Yield Signal API",
    description="Weather-to-Yield signal detection — Corteva Hackathon",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: list[dict[str, str]] | None = None

class ChatResponse(BaseModel):
    content: str
    metadata: dict[str, Any] | None = None

def call_model(message: str, history: list | None = None) -> str:
    """
    Sends the user's message and the pre-uploaded CSV file to Gemini.
    """
    if not sample_file:
        return "Error: The dataset was not successfully uploaded to Gemini on server startup. Check your API key and file path."

    try:
        # Pass BOTH the uploaded file reference and the user's text to the model
        response = gemini_model.generate_content([sample_file, message])
        return response.text
    except Exception as e:
        return f"Error communicating with Gemini API: {str(e)}"

@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    history = req.history or []
    content = call_model(req.message, history=history)
    return ChatResponse(content=content)