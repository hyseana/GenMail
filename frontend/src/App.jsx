import React from 'react';
import { useState } from 'react';
import EmailForm from './components/EmailForm';

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-pink-100 flex flex-col justify-center items-center py-4 px-2 sm:py-8 sm:px-4 lg:py-12 lg:px-8 transition-all duration-500">
      <div
        className={`w-full mx-auto transition-all duration-500
          ${hasChat ? 'sm:max-w-3xl lg:max-w-5xl xl:max-w-7xl' : 'max-w-md'}
        `}
      >
        <div
          className={`relative bg-white/90 shadow-lg rounded-2xl border border-blue-100 transition-all duration-500
            ${hasChat ? 'px-0 py-4 sm:px-4 sm:py-8' : 'px-4 py-8 sm:px-8 sm:py-12'}
          `}
        >
          {/* Layout dinamico: centrale o due colonne */}
          {!hasChat ? (
            // Layout compatto e centrato
            <div className="flex flex-col items-center">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-2 text-center animate-fade-in">Smart Email Writer</h1>
              <p className="text-gray-500 text-center max-w-2xl animate-fade-in-slow mb-8">Genera email professionali in italiano con l'aiuto dell'AI. Scegli il tipo, il tono e inserisci i punti chiave: il resto lo fa il nostro assistente!</p>
              <div className="w-full">
                <EmailForm onSubmit={generateEmail} isLoading={isLoading} />
              </div>
            </div>
          ) : (
            // Layout espanso a due colonne
            <div className="flex flex-col md:flex-row gap-8 w-full mx-auto">
              {/* Colonna sinistra: Form e pulsante */}
              <div className="md:w-1/3 w-full flex flex-col gap-4 justify-start items-stretch">
                <div className="sticky top-8">
                  <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-2 text-center animate-fade-in">Smart Email Writer</h1>
                    <p className="text-gray-500 text-center max-w-2xl animate-fade-in-slow">Genera email professionali in italiano con l'aiuto dell'AI. Scegli il tipo, il tono e inserisci i punti chiave: il resto lo fa il nostro assistente!</p>
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
              {/* Colonna destra: Chat */}
              <div className="md:w-2/3 w-full flex flex-col">
                <div className="divide-y divide-gray-200 flex-1">
                  <div className="py-4 sm:py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    {/* Chat History */}
                    <div className="space-y-4 mb-4 sm:mb-8 max-h-64 sm:max-h-96 overflow-y-auto transition-all duration-300">
                      {chatHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                          <div
                            className={`relative max-w-[80%] p-2 sm:p-4 rounded-2xl shadow-md text-sm sm:text-base break-words transition-all duration-300
                              ${message.type === 'user'
                                ? 'bg-blue-500 text-white ml-2 sm:ml-4 rounded-br-none'
                                : 'bg-gray-200 text-gray-800 mr-2 sm:mr-4 rounded-bl-none border border-gray-300'}
                            `}
                          >
                            <div className="text-xs sm:text-xs text-gray-500 mb-1">
                              {message.type === 'user' ? 'Tu' : <span className="text-pink-500">Assistente</span>} <span className="text-gray-400">{new Date(message.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className="whitespace-pre-wrap break-words">{message.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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