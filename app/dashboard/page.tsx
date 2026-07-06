import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { createClient } from '@/lib/supabase/server'
import { Proposal } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: proposals } = await supabase
    .from('proposals')
    .select('*, calls(client_name, client_company)')
    .order('created_at', { ascending: false })

  const proposalsWithCall = proposals as (Proposal & {
    calls?: { client_name?: string; client_company?: string }
  })[]

  return (
    <div className="wrap">
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 0', borderBottom: '1px solid var(--color-line)' }}>
        <Link href="/">
          <Logo />
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link
            href="/settings"
            style={{ color: 'var(--color-muted)', textDecoration: 'none', fontSize: '0.95rem' }}
          >
            Settings
          </Link>
          <Link href="/new" className="btn small">
            New proposal
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main style={{ paddingTop: '48px', paddingBottom: '80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', marginBottom: '8px' }}>
            Proposals
          </h1>
          <p style={{ color: 'var(--color-muted)' }}>
            {proposalsWithCall?.length || 0} total
          </p>
        </div>

        {/* Proposals table */}
        {proposalsWithCall && proposalsWithCall.length > 0 ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Activity</th>
                </tr>
              </thead>
              <tbody>
                {proposalsWithCall.map((proposal) => {
                  const total = proposal.pricing?.reduce(
                    (sum, item) => sum + (item.total || 0),
                    0
                  ) || 0

                  const clientName = proposal.calls?.client_name || 'Unknown'
                  const clientCompany = proposal.calls?.client_company

                  return (
                    <tr key={proposal.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                          {clientName}
                        </div>
                        {clientCompany && (
                          <div style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>
                            {clientCompany}
                          </div>
                        )}
                      </td>
                      <td>
                        <Link
                          href={`/proposal/${proposal.id}`}
                          style={{ color: 'var(--color-green)', textDecoration: 'none', fontWeight: 500 }}
                        >
                          {proposal.title}
                        </Link>
                      </td>
                      <td>
                        <span className={`status-pill ${proposal.status}`}>
                          {proposal.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700 }}>
                          €{total.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>
                            {new Date(proposal.updated_at).toLocaleDateString()}
                          </div>
                          {proposal.client_viewed_at && (
                            <span
                              style={{ width: '8px', height: '8px', background: 'var(--color-green)', borderRadius: '50%' }}
                              title="Viewed by client"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '80px 40px' }}>
            <p style={{ color: 'var(--color-muted)', marginBottom: '24px', fontSize: '1.1rem' }}>
              No proposals yet.
            </p>
            <Link href="/new" className="btn">
              Create your first proposal
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
