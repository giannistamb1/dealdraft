'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from './Logo'
import { Proposal, Call, AgencySettings, ProposalSection, PricingItem } from '@/lib/types'

interface ProposalEditorProps {
  proposal: Proposal
  call: Call
  settings: AgencySettings
}

export function ProposalEditor({ proposal: initialProposal, call, settings }: ProposalEditorProps) {
  const [proposal, setProposal] = useState(initialProposal)
  const [activeSection, setActiveSection] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [rewriteInstruction, setRewriteInstruction] = useState('')
  const [isRewriting, setIsRewriting] = useState(false)

  const handleSectionEdit = (index: number, content: string) => {
    const newSections = [...proposal.sections]
    newSections[index].content_md = content
    setProposal({ ...proposal, sections: newSections })
  }

  const handleSectionRewrite = async (index: number) => {
    if (!rewriteInstruction.trim()) return

    setIsRewriting(true)
    try {
      const response = await fetch('/api/proposals/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: proposal.id,
          sectionIndex: index,
          instruction: rewriteInstruction,
        }),
      })

      if (!response.ok) throw new Error('Rewrite failed')

      const { content } = await response.json()
      handleSectionEdit(index, content)
      setRewriteInstruction('')
    } catch (error) {
      console.error('Rewrite error:', error)
      alert('Failed to rewrite section')
    } finally {
      setIsRewriting(false)
    }
  }

  const handlePricingEdit = (index: number, field: keyof PricingItem, value: any) => {
    const newPricing = [...proposal.pricing]
    newPricing[index] = { ...newPricing[index], [field]: value }

    // Recalculate total
    if (field === 'qty' || field === 'unit_price') {
      newPricing[index].total = newPricing[index].qty * newPricing[index].unit_price
    }

    setProposal({ ...proposal, pricing: newPricing })
  }

  const addPricingItem = () => {
    setProposal({
      ...proposal,
      pricing: [
        ...proposal.pricing,
        { item: '', description: '', qty: 1, unit_price: 0, total: 0 },
      ],
    })
  }

  const removePricingItem = (index: number) => {
    const newPricing = proposal.pricing.filter((_, i) => i !== index)
    setProposal({ ...proposal, pricing: newPricing })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/proposals/${proposal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: proposal.sections,
          pricing: proposal.pricing,
          title: proposal.title,
          status: proposal.status,
        }),
      })

      if (!response.ok) throw new Error('Save failed')
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      const response = await fetch(`/api/proposals/${proposal.id}/pdf`)
      if (!response.ok) throw new Error('PDF export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${proposal.title}.pdf`
      a.click()
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Failed to export PDF')
    }
  }

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/p/${proposal.share_token}`
    navigator.clipboard.writeText(shareUrl)
    alert('Share link copied to clipboard')
  }

  const totalValue = proposal.pricing.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="min-h-screen bg-bond">
      {/* Header */}
      <header className="border-b border-ink/10 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard">
              <Logo className="h-6 text-ink" />
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm text-ink border border-ink/20 rounded hover:bg-bond transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 text-sm text-ink border border-ink/20 rounded hover:bg-bond transition-colors"
              >
                Export PDF
              </button>
              <button
                onClick={handleCopyShareLink}
                className="px-4 py-2 text-sm bg-brass text-bond rounded hover:bg-brass/90 transition-colors"
              >
                Copy share link
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              value={proposal.title}
              onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
              className="flex-1 text-lg font-display text-ink bg-transparent border-none focus:outline-none"
            />
            <select
              value={proposal.status}
              onChange={(e) => setProposal({ ...proposal, status: e.target.value as any })}
              className="px-3 py-1 text-sm border border-ink/20 rounded focus:outline-none focus:border-brass"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-6">
        {/* Left: Section list */}
        <div className="col-span-3">
          <div className="bg-white border border-ink/10 rounded-lg p-4 sticky top-24">
            <h3 className="text-sm font-medium text-ink mb-3">Sections</h3>
            <div className="space-y-1">
              {proposal.sections.map((section, index) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(index)}
                  className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                    activeSection === index
                      ? 'bg-brass/10 text-brass font-medium'
                      : 'text-carbon hover:bg-bond'
                  }`}
                >
                  {section.title}
                </button>
              ))}
              <button
                onClick={() => setActiveSection(proposal.sections.length)}
                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                  activeSection === proposal.sections.length
                    ? 'bg-brass/10 text-brass font-medium'
                    : 'text-carbon hover:bg-bond'
                }`}
              >
                Pricing
              </button>
            </div>
          </div>
        </div>

        {/* Center: Editor */}
        <div className="col-span-6">
          {activeSection < proposal.sections.length ? (
            <SectionEditor
              section={proposal.sections[activeSection]}
              onEdit={(content) => handleSectionEdit(activeSection, content)}
              onRewrite={() => handleSectionRewrite(activeSection)}
              rewriteInstruction={rewriteInstruction}
              setRewriteInstruction={setRewriteInstruction}
              isRewriting={isRewriting}
            />
          ) : (
            <PricingEditor
              pricing={proposal.pricing}
              currency={settings.currency}
              onEdit={handlePricingEdit}
              onAdd={addPricingItem}
              onRemove={removePricingItem}
            />
          )}
        </div>

        {/* Right: Insights panel */}
        <div className="col-span-3">
          {call.extraction && (
            <div className="bg-white border border-ink/10 rounded-lg p-4 sticky top-24">
              <h3 className="text-sm font-medium text-ink mb-3">Extraction Insights</h3>

              {call.extraction.pain_points && call.extraction.pain_points.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-carbon mb-2">Pain Points</div>
                  <div className="space-y-2">
                    {call.extraction.pain_points.map((pp, i) => (
                      <div key={i} className="text-xs">
                        <div className="text-ink mb-1">{pp.point}</div>
                        <div className="text-carbon/60 italic">"{pp.quote}"</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {call.extraction.budget_signals && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-carbon mb-1">Budget</div>
                  <div className="text-xs text-ink">{call.extraction.budget_signals}</div>
                </div>
              )}

              {call.extraction.timeline_signals && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-carbon mb-1">Timeline</div>
                  <div className="text-xs text-ink">{call.extraction.timeline_signals}</div>
                </div>
              )}

              <div className="pt-3 border-t border-ink/10">
                <div className="text-xs text-carbon">Total value</div>
                <div className="text-lg font-mono text-ink">
                  {settings.currency}{totalValue.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SectionEditor({
  section,
  onEdit,
  onRewrite,
  rewriteInstruction,
  setRewriteInstruction,
  isRewriting,
}: {
  section: ProposalSection
  onEdit: (content: string) => void
  onRewrite: () => void
  rewriteInstruction: string
  setRewriteInstruction: (value: string) => void
  isRewriting: boolean
}) {
  return (
    <div className="bg-white border border-ink/10 rounded-lg p-6">
      <h2 className="font-display text-xl text-ink mb-4">{section.title}</h2>

      <textarea
        value={section.content_md}
        onChange={(e) => onEdit(e.target.value)}
        className="w-full h-96 px-4 py-3 border border-ink/20 rounded focus:outline-none focus:border-brass text-sm font-sans resize-y mb-4"
      />

      <div className="pt-4 border-t border-ink/10">
        <div className="text-sm font-medium text-ink mb-2">Rewrite section</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={rewriteInstruction}
            onChange={(e) => setRewriteInstruction(e.target.value)}
            placeholder="e.g., shorter, more formal, add a phased option"
            className="flex-1 px-3 py-2 text-sm border border-ink/20 rounded focus:outline-none focus:border-brass"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isRewriting) {
                onRewrite()
              }
            }}
          />
          <button
            onClick={onRewrite}
            disabled={!rewriteInstruction.trim() || isRewriting}
            className="px-4 py-2 text-sm bg-brass text-bond rounded hover:bg-brass/90 transition-colors disabled:opacity-50"
          >
            {isRewriting ? 'Rewriting...' : 'Rewrite'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PricingEditor({
  pricing,
  currency,
  onEdit,
  onAdd,
  onRemove,
}: {
  pricing: PricingItem[]
  currency: string
  onEdit: (index: number, field: keyof PricingItem, value: any) => void
  onAdd: () => void
  onRemove: (index: number) => void
}) {
  const total = pricing.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="bg-white border border-ink/10 rounded-lg p-6">
      <h2 className="font-display text-xl text-ink mb-4">Pricing</h2>

      <div className="space-y-4 mb-4">
        {pricing.map((item, index) => (
          <div key={index} className="p-4 border border-ink/10 rounded">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={item.item}
                onChange={(e) => onEdit(index, 'item', e.target.value)}
                placeholder="Item name"
                className="px-3 py-2 text-sm border border-ink/20 rounded focus:outline-none focus:border-brass"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => onEdit(index, 'qty', parseFloat(e.target.value) || 0)}
                  placeholder="Qty"
                  className="w-20 px-3 py-2 text-sm font-mono border border-ink/20 rounded focus:outline-none focus:border-brass"
                />
                <input
                  type="number"
                  value={item.unit_price}
                  onChange={(e) => onEdit(index, 'unit_price', parseFloat(e.target.value) || 0)}
                  placeholder="Price"
                  className="flex-1 px-3 py-2 text-sm font-mono border border-ink/20 rounded focus:outline-none focus:border-brass"
                />
              </div>
            </div>
            <textarea
              value={item.description}
              onChange={(e) => onEdit(index, 'description', e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 text-sm border border-ink/20 rounded focus:outline-none focus:border-brass resize-none mb-2"
              rows={2}
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => onRemove(index)}
                className="text-xs text-red-600 hover:text-red-800 transition-colors"
              >
                Remove
              </button>
              <div className="font-mono text-sm text-ink">
                {currency}{item.total.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAdd}
        className="w-full py-2 text-sm text-brass border border-brass/30 rounded hover:bg-brass/5 transition-colors mb-4"
      >
        + Add item
      </button>

      <div className="pt-4 border-t border-ink/10">
        <div className="flex items-center justify-between">
          <div className="font-display text-lg text-ink">Total</div>
          <div className="font-mono text-2xl text-ink">
            {currency}{total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}
