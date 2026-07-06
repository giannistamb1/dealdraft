'use client'

import { useState } from 'react'

export function WaitlistForm() {
  const [agency, setAgency] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agency, email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to join waitlist')
      }

      setSuccess(true)
      setAgency('')
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px', background: 'var(--color-green-soft)', borderRadius: '18px' }}>
        <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-green)', marginBottom: '8px' }}>
          ✓ You're on the list!
        </p>
        <p style={{ color: 'var(--color-muted)' }}>
          We'll reach out with next steps in priority order.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <input
        type="text"
        value={agency}
        onChange={(e) => setAgency(e.target.value)}
        placeholder="Agency name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button
        type="submit"
        className="btn"
        disabled={isSubmitting}
        style={{ width: '100%', fontSize: '1.1rem', padding: '19px' }}
      >
        {isSubmitting ? 'Joining...' : 'Reserve my spot'}
      </button>
      {error && (
        <p style={{ color: '#C00', fontSize: '0.9rem', textAlign: 'center' }}>
          {error}
        </p>
      )}
      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', textAlign: 'center' }}>
        No spam. Just your priority and next steps.
      </p>
    </form>
  )
}
