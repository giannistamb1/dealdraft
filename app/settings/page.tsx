'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { AgencySettings, Service, TemplateSection } from '@/lib/types'

export default function SettingsPage() {
  const [settings, setSettings] = useState<AgencySettings | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('Failed to load settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Load settings error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to save settings')
      alert('Settings saved successfully')
    } catch (error) {
      console.error('Save settings error:', error)
      alert('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bond flex items-center justify-center">
        <div className="text-ink">Loading...</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-bond flex items-center justify-center">
        <div className="text-ink">Settings not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bond">
      {/* Header */}
      <header className="border-b border-ink/10 bg-bond">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Logo className="h-7 text-ink" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-carbon hover:text-ink transition-colors"
            >
              Back to dashboard
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-brass text-bond text-sm font-medium rounded hover:bg-brass/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink mb-2">Settings</h1>
          <p className="text-carbon">Configure your agency branding and proposal template</p>
        </div>

        <div className="space-y-6">
          {/* Branding */}
          <div className="bg-white border border-ink/10 rounded-lg p-6">
            <h2 className="font-display text-xl text-ink mb-4">Branding</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Agency name *
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full px-4 py-2 border border-ink/20 rounded focus:outline-none focus:border-brass"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Primary color
                  </label>
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) =>
                      setSettings({ ...settings, primary_color: e.target.value })
                    }
                    className="w-full h-10 border border-ink/20 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Secondary color
                  </label>
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) =>
                      setSettings({ ...settings, secondary_color: e.target.value })
                    }
                    className="w-full h-10 border border-ink/20 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Website</label>
                <input
                  type="text"
                  value={settings.website || ''}
                  onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                  placeholder="https://yoursite.com"
                  className="w-full px-4 py-2 border border-ink/20 rounded focus:outline-none focus:border-brass"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  About blurb
                </label>
                <textarea
                  value={settings.about_blurb || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, about_blurb: e.target.value })
                  }
                  placeholder="One-sentence description of your agency"
                  className="w-full px-4 py-2 border border-ink/20 rounded focus:outline-none focus:border-brass resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Tone instructions */}
          <div className="bg-white border border-ink/10 rounded-lg p-6">
            <h2 className="font-display text-xl text-ink mb-4">Tone & Voice</h2>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Tone instructions
              </label>
              <p className="text-sm text-carbon mb-3">
                Tell the AI how you write. Be specific about voice, perspective, sentence
                length, etc.
              </p>
              <textarea
                value={settings.tone_instructions || ''}
                onChange={(e) =>
                  setSettings({ ...settings, tone_instructions: e.target.value })
                }
                placeholder='e.g., "Direct and confident. Use we/our. No buzzwords. Lead with outcomes..."'
                className="w-full px-4 py-3 border border-ink/20 rounded focus:outline-none focus:border-brass font-mono text-sm resize-y"
                rows={4}
              />
            </div>
          </div>

          {/* Services */}
          <div className="bg-white border border-ink/10 rounded-lg p-6">
            <h2 className="font-display text-xl text-ink mb-4">Services</h2>
            <div className="space-y-4 mb-4">
              {settings.services.map((service, index) => (
                <div key={index} className="p-4 border border-ink/10 rounded">
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => {
                        const newServices = [...settings.services]
                        newServices[index].name = e.target.value
                        setSettings({ ...settings, services: newServices })
                      }}
                      placeholder="Service name"
                      className="px-3 py-2 text-sm border border-ink/20 rounded focus:outline-none focus:border-brass"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={service.price_from}
                        onChange={(e) => {
                          const newServices = [...settings.services]
                          newServices[index].price_from = parseFloat(e.target.value) || 0
                          setSettings({ ...settings, services: newServices })
                        }}
                        placeholder="Price from"
                        className="flex-1 px-3 py-2 text-sm border border-ink/20 rounded focus:outline-none focus:border-brass"
                      />
                      <input
                        type="text"
                        value={service.unit}
                        onChange={(e) => {
                          const newServices = [...settings.services]
                          newServices[index].unit = e.target.value
                          setSettings({ ...settings, services: newServices })
                        }}
                        placeholder="Unit"
                        className="w-24 px-3 py-2 text-sm border border-ink/20 rounded focus:outline-none focus:border-brass"
                      />
                    </div>
                  </div>
                  <textarea
                    value={service.description}
                    onChange={(e) => {
                      const newServices = [...settings.services]
                      newServices[index].description = e.target.value
                      setSettings({ ...settings, services: newServices })
                    }}
                    placeholder="Description"
                    className="w-full px-3 py-2 text-sm border border-ink/20 rounded focus:outline-none focus:border-brass resize-none"
                    rows={2}
                  />
                  <button
                    onClick={() => {
                      const newServices = settings.services.filter((_, i) => i !== index)
                      setSettings({ ...settings, services: newServices })
                    }}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remove service
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setSettings({
                  ...settings,
                  services: [
                    ...settings.services,
                    { name: '', description: '', price_from: 0, unit: 'project' },
                  ],
                })
              }}
              className="w-full py-2 text-sm text-brass border border-brass/30 rounded hover:bg-brass/5 transition-colors"
            >
              + Add service
            </button>
          </div>

          {/* Template sections */}
          <div className="bg-white border border-ink/10 rounded-lg p-6">
            <h2 className="font-display text-xl text-ink mb-4">Template Sections</h2>
            <div className="space-y-4">
              {settings.template_sections.map((section, index) => (
                <div key={index} className="p-4 border border-ink/10 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const newSections = [...settings.template_sections]
                        newSections[index].title = e.target.value
                        setSettings({ ...settings, template_sections: newSections })
                      }}
                      className="flex-1 px-3 py-2 text-sm font-medium border border-ink/20 rounded focus:outline-none focus:border-brass"
                    />
                    <label className="ml-3 flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={(e) => {
                          const newSections = [...settings.template_sections]
                          newSections[index].enabled = e.target.checked
                          setSettings({ ...settings, template_sections: newSections })
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-carbon">Enabled</span>
                    </label>
                  </div>
                  <textarea
                    value={section.instructions}
                    onChange={(e) => {
                      const newSections = [...settings.template_sections]
                      newSections[index].instructions = e.target.value
                      setSettings({ ...settings, template_sections: newSections })
                    }}
                    placeholder="Instructions for AI on how to write this section"
                    className="w-full px-3 py-2 text-sm border border-ink/20 rounded focus:outline-none focus:border-brass resize-none"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="bg-white border border-ink/10 rounded-lg p-6">
            <h2 className="font-display text-xl text-ink mb-4">Default Terms</h2>
            <textarea
              value={settings.default_terms || ''}
              onChange={(e) =>
                setSettings({ ...settings, default_terms: e.target.value })
              }
              placeholder="Payment terms, validity period, etc."
              className="w-full px-4 py-3 border border-ink/20 rounded focus:outline-none focus:border-brass resize-y"
              rows={4}
            />
          </div>

          {/* Currency */}
          <div className="bg-white border border-ink/10 rounded-lg p-6">
            <h2 className="font-display text-xl text-ink mb-4">Currency</h2>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="px-4 py-2 border border-ink/20 rounded focus:outline-none focus:border-brass"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  )
}
