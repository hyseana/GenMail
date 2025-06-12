import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api'

// In-memory chat history storage
const chatHistory = new Map()

app.use(cors())
app.use(express.json())

// Email generation endpoint
app.post('/api/generate-email', async (req, res) => {
  try {
    const { type, tone, content, sessionId } = req.body

    // Map email types to Italian descriptions
    const emailTypeMap = {
      leave: 'richiesta di ferie',
      complaint: 'reclamo',
      followup: 'follow-up',
      thank: 'ringraziamento',
      other: 'generica',
    }

    // Map tones to Italian descriptions
    const toneMap = {
      formal: 'formale',
      friendly: 'amichevole',
      assertive: 'assertivo',
      professional: 'professionale',
    }

    const prompt = `Scrivi un'email ${emailTypeMap[type]} in italiano con un tono ${toneMap[tone]}. 
    ${content ? `Considera i seguenti punti:\n${content}` : ''}
    
    L'email deve essere professionale, chiara e concisa. Includi un oggetto appropriato.`

    // Get chat history for this session
    const history = chatHistory.get(sessionId) || []
    
    // Create messages array with history
    const messages = [
      {
        role: "system",
        content: "Sei un assistente esperto nella scrittura di email professionali in italiano."
      },
      ...history,
      {
        role: "user",
        content: prompt
      }
    ]

    // Format messages for Ollama
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    const response = await axios.post(`${OLLAMA_API_URL}/chat`, {
      model: "llama3",
      messages: formattedMessages,
      stream: false
    })

    const generatedEmail = response.data.message.content

    // Update chat history
    history.push(
      { role: "user", content: prompt },
      { role: "assistant", content: generatedEmail }
    )
    chatHistory.set(sessionId, history)

    res.json({ email: generatedEmail })
  } catch (error) {
    console.error('Error generating email:', error)
    res.status(500).json({ error: 'Failed to generate email' })
  }
})

// Clear chat history endpoint
app.post('/api/clear-history', (req, res) => {
  const { sessionId } = req.body
  if (sessionId) {
    chatHistory.delete(sessionId)
    res.json({ message: 'Chat history cleared' })
  } else {
    res.status(400).json({ error: 'Session ID required' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}) 