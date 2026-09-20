export interface Message {
  role: 'user' | 'assistant'
  content: string
}

/** Payload sent to your model / Databricks endpoint */
export interface ChatRequest {
  message: string
  /** Optional: include conversation history for context */
  history?: Array<{ role: string; content: string }>
}

/** Response shape from your model — adapt to match Databricks model output */
export interface ChatResponse {
  content: string
  /** Optional: model-specific metadata (e.g. confidence, signals) */
  metadata?: Record<string, unknown>
}
