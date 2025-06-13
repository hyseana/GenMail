# Smart Email Writer

A web application that generates professional emails using AI, allowing users to customize email type, tone, and content.

## Features

- Generate professional emails using AI
- Choose from different email types (Leave Request, Complaint, Follow-up, etc.)
- Select email tone (Formal, Friendly, Assertive, etc.)
- Customize content with specific points or instructions
- Copy, Regenerate, or Save generated emails

## Tech Stack

- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- AI: Ollama 3
- Deployment: Frontend (Vercel), Backend (Render)

## Project Structure

```
smart-email-writer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmailForm.jsx
│   │   │   └── GeneratedEmail.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── tailwind.config.js
└── backend/
    ├── server.js
    └── .env
```

## Setup Instructions

1. Clone the repository
2. Frontend setup:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Backend setup:
   ```bash
   cd backend
   npm install
   # Create .env file with OPENAI_API_KEY
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory with:
```
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```

## License

MIT 
