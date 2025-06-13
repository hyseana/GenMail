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
    const { type, tone, content, sessionId, language } = req.body

    // Map email types and tones for each language
    const emailTypeMap = {
      it: {
        leave: 'richiesta di ferie',
        complaint: 'reclamo',
        followup: 'follow-up',
        thank: 'ringraziamento',
        other: 'generica',
      },
      en: {
        leave: 'leave request',
        complaint: 'complaint',
        followup: 'follow-up',
        thank: 'thank you',
        other: 'generic',
      },
      es: {
        leave: 'solicitud de vacaciones',
        complaint: 'queja',
        followup: 'seguimiento',
        thank: 'agradecimiento',
        other: 'genérica',
      },
    }

    const toneMap = {
      it: {
        formal: 'formale',
        friendly: 'amichevole',
        assertive: 'assertivo',
        professional: 'professionale',
      },
      en: {
        formal: 'formal',
        friendly: 'friendly',
        assertive: 'assertive',
        professional: 'professional',
      },
      es: {
        formal: 'formal',
        friendly: 'amistoso',
        assertive: 'asertivo',
        professional: 'profesional',
      },
    }

    const systemMessages = {
      it: "Sei un assistente esperto nella scrittura di email professionali in italiano.",
      en: "You are an expert assistant in writing professional emails in English.",
      es: "Eres un asistente experto en la redacción de correos electrónicos profesionales en español.",
    }

    const promptTemplates = {
      it: `Scrivi un'email {type} in italiano con un tono {tone}.
{content}
L'email deve essere professionale, chiara e concisa. Includi un oggetto appropriato.`,
      en: `Write a {type} email in English with a {tone} tone.
{content}
The email must be professional, clear, and concise. Include an appropriate subject line.`,
      es: `Escribe un correo electrónico {type} en español con un tono {tone}.
{content}
El correo debe ser profesional, claro y conciso. Incluye un asunto apropiado.`,
    }

    const lang = language || 'it'
    const typeText = emailTypeMap[lang]?.[type] || type
    const toneText = toneMap[lang]?.[tone] || tone
    const contentText = content ? (lang === 'it' ? `Considera i seguenti punti:\n${content}` : lang === 'en' ? `Consider the following points:\n${content}` : `Considera los siguientes puntos:\n${content}`) : ''
    const prompt = promptTemplates[lang]
      .replace('{type}', typeText)
      .replace('{tone}', toneText)
      .replace('{content}', contentText)

    // Get chat history for this session
    const history = chatHistory.get(sessionId) || []
    // Create messages array with history
    const messages = [
      {
        role: "system",
        content: systemMessages[lang] || systemMessages['it']
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