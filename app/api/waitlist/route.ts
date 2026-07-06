import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { agency, email } = body

    if (!agency || !email) {
      return NextResponse.json(
        { error: 'Agency name and email are required' },
        { status: 400 }
      )
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Send confirmation email to the person who signed up
    await resend.emails.send({
      from: 'DealDraft <onboarding@resend.dev>',
      to: email,
      subject: '✓ You\'re on the DealDraft waitlist',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px 20px;">
            <h1 style="font-family: Manrope, sans-serif; font-weight: 800; font-size: 2rem; color: #0E6B4F; margin-bottom: 16px;">
              You're on the list!
            </h1>
            <p style="font-size: 1.1rem; color: #6B7280; margin-bottom: 32px;">
              Thanks for joining the DealDraft waitlist, <strong>${agency}</strong>.
            </p>
          </div>

          <div style="background: #F6F7F6; border-radius: 16px; padding: 32px 24px; margin-bottom: 32px;">
            <h2 style="font-family: Manrope, sans-serif; font-weight: 700; font-size: 1.3rem; color: #0B0F0D; margin-bottom: 16px;">
              What happens next?
            </h2>
            <ol style="color: #6B7280; line-height: 1.8; padding-left: 20px;">
              <li>We'll reach out in priority order when a setup slot opens</li>
              <li>Initial call (~30 min) to discuss your proposal process and template</li>
              <li>We configure DealDraft for your agency (sections, services, tone)</li>
              <li>Training session and handoff</li>
            </ol>
          </div>

          <div style="background: #EAF4F0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
            <p style="font-size: 0.95rem; color: #0E6B4F; margin: 0;">
              <strong>Typical timeline:</strong> Setup takes 1-2 weeks from kickoff. We onboard a limited number of agencies each month to ensure quality.
            </p>
          </div>

          <div style="text-align: center; color: #6B7280; font-size: 0.9rem; padding: 20px;">
            <p style="margin-bottom: 8px;">DealDraft — Built for agencies who close</p>
            <p>Questions? Reply to this email.</p>
          </div>
        </div>
      `,
    })

    // Send notification email to you
    await resend.emails.send({
      from: 'DealDraft Waitlist <onboarding@resend.dev>',
      to: 'giannis@rhooalabs.com',
      subject: `🎯 New waitlist signup: ${agency}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="font-family: Manrope, sans-serif; font-weight: 800; color: #0E6B4F; margin-bottom: 16px;">
            New DealDraft Waitlist Signup
          </h2>

          <div style="background: #F6F7F6; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <p style="margin: 0 0 12px 0;"><strong>Agency:</strong> ${agency}</p>
            <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
          </div>

          <p style="color: #6B7280; font-size: 0.9rem; margin: 0;">
            Signed up at ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
