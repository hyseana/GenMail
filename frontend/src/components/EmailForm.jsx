import React from 'react'
import { useState } from 'react'

function EmailForm({ onSubmit, isLoading }) {
  const [type, setType] = useState('other')
  const [tone, setTone] = useState('formal')
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(type, tone, content)
    setContent('') // Clear content after submission
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Tipo di Email
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          disabled={isLoading}
        >
          <option value="leave">Richiesta di Ferie</option>
          <option value="complaint">Reclamo</option>
          <option value="followup">Follow-up</option>
          <option value="thank">Ringraziamento</option>
          <option value="other">Altro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Tono
        </label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          disabled={isLoading}
        >
          <option value="formal">Formale</option>
          <option value="friendly">Amichevole</option>
          <option value="assertive">Assertivo</option>
          <option value="professional">Professionale</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Contenuto
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          placeholder="Inserisci i punti principali da includere nell'email..."
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Generazione in corso...' : 'Genera Email'}
      </button>
    </form>
  )
}

export default EmailForm 