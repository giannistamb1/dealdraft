import Image from 'next/image'

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="DealDraft"
      width={280}
      height={70}
      className={className}
      priority
      style={{ height: 'auto', width: 'auto', maxHeight: '42px' }}
    />
  )
}
