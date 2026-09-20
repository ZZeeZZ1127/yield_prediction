# Yield Signal Backend — Connect Your Databricks Model

This FastAPI app is the bridge between the chatbot UI and your trained model.

## Run locally

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Then run the frontend: `npm run dev` (from project root). The Vite dev server proxies `/api` to port 8000.

## Connect Databricks (free edition)

1. **Model Serving**  
   In Databricks: deploy your model to **Model Serving** and copy the **Query endpoint** URL.

2. **Environment variables**  
   Create a `.env` in `backend/` (or set in your environment):
   - `DATABRICKS_SERVING_URL` — full URL, e.g. `https://.../serving-endpoints/.../invocations`
   - `DATABRICKS_TOKEN` — your Databricks personal access token

3. **Update `call_model()` in `main.py`**  
   Replace the stub with an HTTP call to the serving endpoint, for example:

   ```python
   import httpx

   def call_model(message: str, history=None) -> str:
       url = os.environ.get("DATABRICKS_SERVING_URL")
       token = os.environ.get("DATABRICKS_TOKEN")
       if not url or not token:
           return "Databricks endpoint not configured. Set DATABRICKS_SERVING_URL and DATABRICKS_TOKEN."
       with httpx.Client() as client:
           r = client.post(
               url,
               headers={"Authorization": f"Bearer {token}"},
               json={"inputs": [{"message": message}]},
               timeout=30.0,
           )
           r.raise_for_status()
           out = r.json()
           # Adapt to your model’s response shape, e.g.:
           return out.get("predictions", [out])[0]
   ```

4. **Request/response shape**  
   Adjust the `json=` payload and the parsing of `out` to match how your Databricks model expects inputs and returns predictions (e.g. single string, or list of strings).

Once this is wired, the chatbot will use your weather-to-yield model for every reply.
