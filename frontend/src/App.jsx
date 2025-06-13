import React, { useState, useEffect, useRef } from 'react';
import EmailForm from './components/EmailForm';

const AVATAR_USER = (
  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white dark:border-gray-900">U</div>
);
const AVATAR_AI = (
  <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white dark:border-gray-900">AI</div>
);

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef(null);

  // Applica la classe dark su <html> per Tailwind
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll automatico in basso quando arriva un nuovo messaggio
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const hasChat = chatHistory.length > 0;

  const generateEmail = async (type, tone, content) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          tone,
          content,
          sessionId,
        }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setChatHistory(prev => [
        ...prev,
        {
          type: 'user',
          content: `Tipo: ${type}, Tono: ${tone}\n${content}`,
          timestamp: new Date().toISOString(),
        },
        {
          type: 'assistant',
          content: data.email,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      alert('Errore nella generazione dell\'email: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch('http://localhost:5000/api/clear-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      setChatHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Errore nella cancellazione della cronologia');
    }
  };

  return (
    <div className={`font-sans transition-colors duration-500`}>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 flex flex-col justify-center items-center py-4 px-2 sm:py-8 sm:px-4 lg:py-12 lg:px-8 transition-all duration-500">
        {/* Selettore lingua e dark mode centrati sopra il box */}
        <div className="w-full flex justify-center items-center gap-2 mb-6 max-w-7xl">
          <button
            onClick={() => setDarkMode(d => !d)}
            className={`rounded px-3 py-1 border font-semibold shadow transition-colors
              ${darkMode
                ? 'bg-gray-900 text-white border-gray-700 hover:bg-gray-800'
                : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100'}
            `}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        <div
          className={`w-full mx-auto transition-all duration-500
            ${hasChat ? 'sm:max-w-3xl lg:max-w-5xl xl:max-w-7xl' : 'max-w-md'}
          `}
        >
          <div
            className={`relative shadow-2xl rounded-3xl border border-blue-100 dark:border-gray-800 transition-all duration-500
              ${hasChat ? 'px-0 py-4 sm:px-4 sm:py-8' : 'px-4 py-8 sm:px-8 sm:py-12'}
              bg-white/70 dark:bg-gray-900/80 backdrop-blur-md
              flex flex-col h-full min-h-[500px] md:min-h-[60vh]
            `}
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
          >
            {/* Layout dinamico: centrale o due colonne */}
            {!hasChat ? (
              // Layout compatto e centrato
              <div className="flex flex-col items-center animate-fade-in">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">Smart Email Writer</h1>
                <p className="text-gray-500 dark:text-gray-300 text-center max-w-2xl mb-8">Genera email professionali in italiano con l'aiuto dell'AI. Scegli il tipo, il tono e inserisci i punti chiave: il resto lo fa il nostro assistente!</p>
                <div className="w-full">
                  <EmailForm onSubmit={generateEmail} isLoading={isLoading} />
                </div>
              </div>
            ) : (
              // Layout espanso a due colonne
              <div className="flex-1 flex flex-col md:flex-row gap-8 w-full mx-auto animate-fade-in h-full">
                {/* Colonna sinistra: Form e pulsante */}
                <div className="md:w-1/3 w-full flex flex-col gap-4 justify-start items-stretch h-full">
                  <div className="sticky top-8">
                    <div className="flex flex-col items-center mb-8">
                      <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">Smart Email Writer</h1>
                      <p className="text-gray-500 dark:text-gray-300 text-center max-w-2xl">Genera email professionali in italiano con l'aiuto dell'AI. Scegli il tipo, il tono e inserisci i punti chiave: il resto lo fa il nostro assistente!</p>
                    </div>
                    <EmailForm onSubmit={generateEmail} isLoading={isLoading} />
                    {chatHistory.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-xl shadow hover:bg-red-600 transition-colors font-semibold tracking-wide"
                      >
                        Cancella Cronologia
                      </button>
                    )}
                  </div>
                </div>
                {/* Separatore */}
                <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-blue-200 dark:via-gray-700 to-transparent mx-2 rounded-full"></div>
                {/* Colonna destra: Chat */}
                <div className="md:w-2/3 w-full flex flex-col h-full">
                  <div className="flex-1 flex flex-col h-full">
                    <div className="space-y-4 mb-4 sm:mb-8 overflow-y-auto transition-all duration-300 flex flex-col h-full" style={{ minHeight: '300px', maxHeight: 'calc(100vh - 200px)' }}>
                      {chatHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`flex items-end gap-2 ${message.type === 'user' ? 'justify-end flex-row-reverse' : 'justify-start'} animate-fade-in`}
                        >
                          {/* Avatar */}
                          <div className="flex-shrink-0">{message.type === 'user' ? AVATAR_USER : AVATAR_AI}</div>
                          <div
                            className={`relative max-w-[80%] p-2 sm:p-4 rounded-2xl shadow-md text-sm sm:text-base break-words transition-all duration-300
                              ${message.type === 'user'
                                ? 'bg-blue-500 text-white ml-2 sm:ml-4 rounded-br-none'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 mr-2 sm:mr-4 rounded-bl-none border border-gray-300 dark:border-gray-700'}
                            `}
                          >
                            <div className="text-xs sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {message.type === 'user' ? 'Tu' : <span className="text-pink-500">Assistente</span>} <span className="text-gray-400">{new Date(message.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className="whitespace-pre-wrap break-words">{message.content}</div>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Animazioni Tailwind personalizzate */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        .animate-fade-in-slow { animation: fadeIn 1.5s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

export default App; 