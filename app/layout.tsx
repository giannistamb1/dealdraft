import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DealDraft — From sales call to signed-ready proposal in 10 minutes',
  description: 'Turn agency sales call transcripts into polished, branded proposals in your own template.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
