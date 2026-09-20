# Yield Signal — Weather-to-Yield Chatbot

Corteva Hackathon: **Weather-to-Yield Signal Detection** — a chatbot UI that uses historical yield and weather data (rainfall, temperature, humidity, wind, soil moisture) to answer questions and surface signals. Built to connect to a model trained on **Databricks (free edition)**.

## Theme

- **Corteva / agriculture**: greens (canopy, leaf, growth), earth browns, harvest amber
- **Weather**: sky and rain tones in the palette
- **UI**: Dark, ag-tech feel with Instrument Serif + DM Sans and a subtle grain overlay

## Quick start

1. **Frontend**
   ```bash
   npm install
   npm run dev
   ```
   Opens at http://localhost:5173

2. **Backend (optional for stub; required for real model)**
   ```bash
   cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
   ```
   The dev server proxies `/api` to port 8000.

3. **Connect your Databricks model**  
   See [backend/README.md](backend/README.md) for wiring your trained model to the API.

## Project layout

- `src/` — React + Vite chatbot UI
- `src/api.ts` — API client; backend URL is proxied to `http://127.0.0.1:8000`
- `backend/main.py` — FastAPI app; implement `call_model()` to call Databricks
- `backend/README.md` — Steps to connect Databricks Model Serving

## Tech

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: FastAPI (Python); ready to call Databricks Model Serving or any REST endpoint
