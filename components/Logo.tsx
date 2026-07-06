import Image from 'next/image'

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="DealDraft"
      width={200}
      height={50}
      className={className}
      priority
      style={{ height: 'auto', width: 'auto', maxHeight: '50px' }}
    />
  )
}
