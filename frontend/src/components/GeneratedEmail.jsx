import { useState } from 'react'
import { ClipboardDocumentIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

function GeneratedEmail({ email }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Email Generata</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
            {copied ? 'Copiato!' : 'Copia'}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Rigenera
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap font-mono text-sm">
        {email}
      </div>
    </div>
  )
}

export default GeneratedEmail 