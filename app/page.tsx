import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { WaitlistForm } from '@/components/WaitlistForm'

export default function LandingPage() {
  return (
    <div className="wrap">
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 0' }}>
        <Logo />
        <a href="#waitlist" className="btn small">
          Join waitlist
        </a>
      </nav>

      {/* Hero */}
      <header style={{ padding: '88px 0 40px', textAlign: 'center' }}>
        <span className="eyebrow">For agencies & consultants</span>
        <h1 className="display" style={{ fontSize: 'clamp(3rem, 8vw, 6.4rem)', maxWidth: '16ch', margin: '0 auto' }}>
          From sales call to signed-ready proposal{' '}
          <em style={{ fontStyle: 'normal', color: '#0E6B4F' }}>in 10 minutes.</em>
        </h1>
        <p style={{ fontSize: '1.35rem', color: 'var(--color-muted)', margin: '32px auto 40px', maxWidth: '46ch' }}>
          Turn your agency's sales call transcripts into polished, branded proposals written in your voice, using your template.
        </p>
        <a href="#waitlist" className="btn">
          Join the waitlist
        </a>

        {/* Stage: transcript → proposal */}
        <div
          style={{
            maxWidth: '960px',
            margin: '64px auto 0',
            background: 'var(--color-gray)',
            borderRadius: '32px',
            padding: '56px 32px',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '28px',
            alignItems: 'center',
          }}
        >
          {/* Transcript */}
          <div className="doc">
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '10px', padding: '8px 12px', borderRadius: '10px' }}>
              <b style={{ color: 'var(--color-text)' }}>Client:</b> ...we're losing leads because no one responds fast enough...
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '10px', padding: '8px 12px', borderRadius: '10px' }}>
              <b style={{ color: 'var(--color-text)' }}>Client:</b> ...our budget is around 4 to 5k...
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '10px', padding: '8px 12px', borderRadius: '10px' }}>
              <b style={{ color: 'var(--color-text)' }}>You:</b> ...we'll set it up in three phases, starting with...
            </div>
          </div>

          {/* Flow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--color-green)', fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
            <div className="pulse">→</div>
            <span>DEALDRAFT</span>
          </div>

          {/* Proposal */}
          <div className="doc proposal">
            <div className="letterhead">
              <b>Northbeam Digital</b>
              <span>Proposal · {new Date().toLocaleDateString()}</span>
            </div>
            <h4 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1rem', marginBottom: '8px' }}>
              Understanding Your Need
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              As we discussed, the main cost today is leads going unanswered. We propose a three-phase system...
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed var(--color-line)', fontWeight: 700, fontSize: '0.92rem' }}>
              <span>Total investment</span>
              <b style={{ color: 'var(--color-green)' }}>€4,800</b>
            </div>
          </div>
        </div>
      </header>

      {/* Integration strip */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', padding: '36px 0', borderTop: '1px solid var(--color-line)', borderBottom: '1px solid var(--color-line)', marginTop: '72px', color: 'var(--color-muted)', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>
        <span>Fireflies</span>
        <span>Fathom</span>
        <span>Zoom</span>
        <span>Teams</span>
        <span>Google Meet</span>
      </div>

      {/* Value prop */}
      <section style={{ padding: '56px 0' }}>
        <div className="block white">
          <h2 className="display" style={{ fontSize: 'clamp(2.3rem, 4.8vw, 3.8rem)', marginBottom: '22px', maxWidth: '24ch' }}>
            The best sales call is worthless if the proposal takes three days.
          </h2>
          <p style={{ fontSize: '1.25rem', maxWidth: '58ch', color: 'var(--color-muted)' }}>
            The call goes perfectly, the client is warm — and then the proposal sits on your "to write" list for days. Meanwhile, they're talking to competitors. DealDraft closes that gap: the proposal goes out the same day, written in the client's own words.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '56px 0' }}>
        <div className="block">
          <h2 className="display" style={{ fontSize: 'clamp(2.3rem, 4.8vw, 3.8rem)', marginBottom: '52px' }}>
            How it works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '36px' }}>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '2.6rem', color: 'var(--color-green)', lineHeight: 1, marginBottom: '16px' }}>
                1
              </div>
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.18rem', marginBottom: '10px' }}>
                Paste transcript
              </h3>
              <p style={{ fontSize: '0.98rem', color: 'var(--color-muted)' }}>
                From whatever tool you already use to record your calls.
              </p>
            </div>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '36px' }}>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '2.6rem', color: 'var(--color-green)', lineHeight: 1, marginBottom: '16px' }}>
                2
              </div>
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.18rem', marginBottom: '10px' }}>
                Review draft
              </h3>
              <p style={{ fontSize: '0.98rem', color: 'var(--color-muted)' }}>
                Needs, budget, and timeline extracted from the call. Proposal written in your template and tone. You approve.
              </p>
            </div>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '36px' }}>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '2.6rem', color: 'var(--color-green)', lineHeight: 1, marginBottom: '16px' }}>
                3
              </div>
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.18rem', marginBottom: '10px' }}>
                Send & close
              </h3>
              <p style={{ fontSize: '0.98rem', color: 'var(--color-muted)' }}>
                PDF or web link with accept button. See when client opens it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The math */}
      <section style={{ padding: '56px 0' }}>
        <div className="block white">
          <h2 className="display" style={{ fontSize: 'clamp(2.3rem, 4.8vw, 3.8rem)', marginBottom: '22px' }}>
            Do the math.
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-muted)', marginBottom: '44px', maxWidth: '58ch' }}>
            8 proposals per month × 3 hours each — almost a week of work you can't bill.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '44px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '3.2rem', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                3 hours
              </div>
              <p style={{ color: 'var(--color-muted)', marginTop: '10px' }}>
                per proposal today, from your most expensive person
              </p>
            </div>
            <div style={{ background: 'var(--color-green)', borderRadius: '24px', padding: '44px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '3.2rem', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#fff' }}>
                10 minutes
              </div>
              <p style={{ color: '#fff', opacity: 0.85, marginTop: '10px' }}>
                with DealDraft — review, tweak, send
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Your template */}
      <section style={{ padding: '56px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden', borderRadius: '32px' }}>
          <div style={{ background: 'var(--color-green)', color: '#fff', padding: '72px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '18px' }}>
              Your template. Your voice.
            </h2>
            <p style={{ color: '#D3E6DE', fontSize: '1.15rem', maxWidth: '44ch' }}>
              Configured once with your sections, services, pricing, and tone. Every proposal comes out like your best person wrote it on a good day — using the words the client used in the call.
            </p>
          </div>
          <div style={{ minHeight: '380px', backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=70)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" style={{ padding: '56px 0' }}>
        <div className="block" style={{ textAlign: 'center' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2.3rem, 4.8vw, 3.8rem)', marginBottom: '22px', marginLeft: 'auto', marginRight: 'auto', maxWidth: '24ch' }}>
            Join the waitlist
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '40px', marginLeft: 'auto', marginRight: 'auto', maxWidth: '46ch', color: 'var(--color-muted)' }}>
            We're setting up DealDraft for a limited number of agencies each month — fully configured to your template. The waitlist determines priority.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '56px 0', textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
        <Logo />
        <p style={{ marginTop: '16px' }}>Built for agencies who close.</p>
      </footer>
    </div>
  )
}
