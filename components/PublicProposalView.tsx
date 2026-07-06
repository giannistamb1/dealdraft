'use client'

import { useState } from 'react'
import { Proposal, AgencySettings } from '@/lib/types'

interface PublicProposalViewProps {
  proposal: Proposal
  settings: AgencySettings
}

export function PublicProposalView({ proposal, settings }: PublicProposalViewProps) {
  const [isAccepting, setIsAccepting] = useState(false)
  const [hasAccepted, setHasAccepted] = useState(!!proposal.accepted_at)

  const handleAccept = async () => {
    if (hasAccepted) return

    setIsAccepting(true)
    try {
      const response = await fetch('/api/proposals/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareToken: proposal.share_token }),
      })

      if (!response.ok) throw new Error('Failed to accept')

      setHasAccepted(true)
    } catch (error) {
      console.error('Accept error:', error)
      alert('Failed to accept proposal')
    } finally {
      setIsAccepting(false)
    }
  }

  const totalValue = proposal.pricing.reduce((sum, item) => sum + item.total, 0)
  const primaryColor = settings.primary_color || '#14213D'

  return (
    <div className="min-h-screen bg-bond">
      {/* Header */}
      <header
        className="border-b border-ink/10 bg-white"
        style={{ borderColor: `${primaryColor}15` }}
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="letterhead-rule pb-4" style={{ borderColor: primaryColor }}>
            <div className="font-display text-2xl" style={{ color: primaryColor }}>
              {settings.name}
            </div>
            {settings.website && (
              <div className="text-sm text-carbon mt-1">{settings.website}</div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {hasAccepted && (
          <div
            className="mb-8 p-6 bg-white border rounded-lg"
            style={{ borderColor: '#1F7A5C', backgroundColor: '#1F7A5C10' }}
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-accept"
                fill="none"
                strokeWidth={2}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <div className="font-display text-lg text-accept">Proposal Accepted</div>
                <div className="text-sm text-carbon">
                  {new Date(proposal.accepted_at!).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-8">
          {proposal.sections.map((section) => (
            <section key={section.key} className="bg-white border border-ink/10 rounded-lg p-8">
              <h2 className="font-display text-2xl mb-4" style={{ color: primaryColor }}>
                {section.title}
              </h2>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: section.content_md
                    .replace(/^#+ /gm, '')
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>'),
                }}
              />
            </section>
          ))}

          {/* Pricing */}
          {proposal.pricing.length > 0 && (
            <section className="bg-white border border-ink/10 rounded-lg p-8">
              <h2 className="font-display text-2xl mb-6" style={{ color: primaryColor }}>
                Investment
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-sm">
                  <thead className="border-b border-ink/10">
                    <tr>
                      <th className="text-left py-3 font-medium text-carbon">Item</th>
                      <th className="text-left py-3 font-medium text-carbon">Description</th>
                      <th className="text-right py-3 font-medium text-carbon">Qty</th>
                      <th className="text-right py-3 font-medium text-carbon">Price</th>
                      <th className="text-right py-3 font-medium text-carbon">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {proposal.pricing.map((item, index) => (
                      <tr key={index}>
                        <td className="py-3" style={{ color: primaryColor }}>
                          {item.item}
                        </td>
                        <td className="py-3 text-carbon text-xs">{item.description}</td>
                        <td className="py-3 text-right text-carbon">{item.qty}</td>
                        <td className="py-3 text-right text-carbon">
                          {settings.currency}{item.unit_price.toLocaleString()}
                        </td>
                        <td className="py-3 text-right" style={{ color: primaryColor }}>
                          {settings.currency}{item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-ink/20">
                    <tr>
                      <td colSpan={4} className="py-4 text-right font-display text-lg">
                        Total
                      </td>
                      <td
                        className="py-4 text-right font-display text-2xl"
                        style={{ color: primaryColor }}
                      >
                        {settings.currency}{totalValue.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Accept button */}
        {!hasAccepted && (
          <div className="mt-12 text-center">
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className="signature-line px-12 py-4 text-lg font-display bg-brass text-bond rounded hover:bg-brass/90 transition-colors disabled:opacity-50"
            >
              {isAccepting ? 'Processing...' : 'Accept proposal'}
            </button>
            {proposal.valid_until && (
              <p className="mt-4 text-sm text-carbon">
                Valid until {new Date(proposal.valid_until).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/10 bg-white mt-20">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <div className="text-sm text-carbon">{settings.name}</div>
          {settings.website && (
            <div className="text-sm text-carbon/60 mt-1">{settings.website}</div>
          )}
        </div>
      </footer>
    </div>
  )
}
