'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function NewProposalPage() {
  const router = useRouter()
  const [transcript, setTranscript] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientCompany, setClientCompany] = useState('')
  const [sourceLabel, setSourceLabel] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStage, setProcessingStage] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!transcript.trim()) {
      setError('Please paste a transcript')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      setProcessingStage('Reading the call...')
      await new Promise(resolve => setTimeout(resolve, 500))

      const response = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          client_name: clientName || undefined,
          client_company: clientCompany || undefined,
          source_label: sourceLabel || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate proposal')
      }

      const { proposalId } = await response.json()
      router.push(`/proposal/${proposalId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsProcessing(false)
      setProcessingStage('')
    }
  }

  return (
    <div className="min-h-screen bg-bond">
      {/* Header */}
      <header className="border-b border-ink/10 bg-bond">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Logo className="h-7 text-ink" />
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-carbon hover:text-ink transition-colors"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink mb-2">
            New proposal
          </h1>
          <p className="text-carbon">
            Paste your sales call transcript. DealDraft will extract the scope and generate a proposal.
          </p>
        </div>

        {isProcessing ? (
          <div className="bg-white border border-ink/10 rounded-lg p-12 text-center">
            <div className="mb-4">
              <div className="inline-block w-12 h-12 border-4 border-ink/20 border-t-ink rounded-full animate-spin" />
            </div>
            <p className="text-ink text-lg mb-2">Generating proposal</p>
            <p className="text-carbon">{processingStage}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Transcript input */}
            <div className="bg-white border border-ink/10 rounded-lg p-6">
              <label className="block mb-2 text-sm font-medium text-ink">
                Call transcript *
              </label>
              <p className="text-sm text-carbon mb-3">
                From Fireflies, Fathom, Zoom, Teams, or any transcription tool
              </p>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste the full transcript here..."
                className="w-full h-64 px-4 py-3 border border-ink/20 rounded focus:outline-none focus:border-brass font-mono text-sm resize-y"
              />
            </div>

            {/* Optional fields */}
            <div className="bg-white border border-ink/10 rounded-lg p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-ink">
                    Client name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-2 border border-ink/20 rounded focus:outline-none focus:border-brass text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-ink">
                    Company
                  </label>
                  <input
                    type="text"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-2 border border-ink/20 rounded focus:outline-none focus:border-brass text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-ink">
                    Source
                  </label>
                  <input
                    type="text"
                    value={sourceLabel}
                    onChange={(e) => setSourceLabel(e.target.value)}
                    placeholder="e.g., Fireflies"
                    className="w-full px-4 py-2 border border-ink/20 rounded focus:outline-none focus:border-brass text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Coming soon: audio upload */}
            <div className="bg-white border border-ink/10 rounded-lg p-6 opacity-50">
              <label className="block mb-2 text-sm font-medium text-ink">
                Upload recording (coming soon)
              </label>
              <div className="border-2 border-dashed border-ink/20 rounded-lg p-8 text-center">
                <p className="text-carbon text-sm">
                  Audio transcription will be available in a future update
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={!transcript.trim() || isProcessing}
                className="px-6 py-3 bg-brass text-bond font-medium rounded hover:bg-brass/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate proposal
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
