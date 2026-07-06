import Image from 'next/image'

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="DealDraft"
      width={350}
      height={88}
      className={className}
      priority
      style={{ height: 'auto', width: 'auto', maxWidth: '160px' }}
    />
  )
}
