import { useState, useRef, useEffect } from 'react'
import { sendMessage } from './api'
import type { Message } from './types'
import './App.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const reply = await sendMessage(text)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply.content },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, the yield signal service is temporarily unavailable. Please ensure the backend is running and your Databricks model endpoint is configured.',
        },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const suggestedPrompts = [
    'How does rainfall affect corn yield in the Midwest?',
    'What weather signals predict soybean yield?',
    'Explain temperature stress on wheat yield.',
    'Which variables matter most for yield prediction?',
  ]

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◇</span>
            <h1 className="logo-title">Yield Signal</h1>
            <span className="logo-subtitle">Weather-to-Yield</span>
          </div>
          <p className="tagline">
            Corteva Hackathon — Detect weather signals that drive crop yield
          </p>
        </div>
      </header>

      <main className="main">
        <div className="chat-panel">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">🌾</div>
              <h2>Ask about weather and yield</h2>
              <p>
                Use historical yield and weather data (rainfall, temperature,
                humidity, wind, soil moisture) to explore signal detection.
              </p>
              <div className="suggestions">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => setInput(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message message--${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'user' ? '👤' : '◇'}
                  </div>
                  <div className="message-bubble">
                    <div className="message-content">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message message--assistant">
                  <div className="message-avatar">◇</div>
                  <div className="message-bubble message-bubble--loading">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          <form className="input-area" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className="input-field"
              placeholder="Ask about weather, crops, yield signals..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!input.trim() || isLoading}
              aria-label="Send"
            >
              Send
            </button>
          </form>
        </div>
      </main>

      <footer className="footer">
        <span>Powered by Corteva Agriscience</span>
        <span className="footer-sep">·</span>
        <span>Connect your Databricks model in <code>src/api.ts</code> & backend</span>
      </footer>
    </div>
  )
}

export default App
