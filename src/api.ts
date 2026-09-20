import type { ChatResponse } from './types'

const API_BASE = '/api'

/**
 * Send a user message to the yield-prediction backend.
 * The backend can be wired to your Databricks model (see backend/README.md).
 */
export async function sendMessage(message: string): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }

  const data = (await res.json()) as ChatResponse
  return data
}

/**
 * Optional: call Databricks model serving directly from the frontend
 * (e.g. if using serverless or a public inference URL).
 *
 * 1. In Databricks: Deploy model to "Model Serving" and copy the endpoint URL.
 * 2. Set VITE_DATABRICKS_ENDPOINT in .env (e.g. https://.../serving-endpoints/.../invocations).
 * 3. Uncomment and use this function, and ensure CORS / auth are configured.
 */
// const DATABRICKS_ENDPOINT = import.meta.env.VITE_DATABRICKS_ENDPOINT as string | undefined
//
// export async function sendMessageToDatabricks(message: string): Promise<ChatResponse> {
//   if (!DATABRICKS_ENDPOINT) throw new Error('VITE_DATABRICKS_ENDPOINT is not set')
//   const res = await fetch(DATABRICKS_ENDPOINT, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${import.meta.env.VITE_DATABRICKS_TOKEN}`,
//     },
//     body: JSON.stringify({ inputs: [{ message }] }),
//   })
//   if (!res.ok) throw new Error(await res.text())
//   const json = await res.json()
//   return { content: json.predictions?.[0] ?? json.content ?? String(json) }
// }
