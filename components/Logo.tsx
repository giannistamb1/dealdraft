import Image from 'next/image'

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="DealDraft"
      width={180}
      height={40}
      className={className}
      priority
    />
  )
}
