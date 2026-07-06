export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`font-display font-extrabold text-2xl ${className}`} style={{ letterSpacing: '-0.02em' }}>
      Deal<span style={{ color: '#0E6B4F' }}>Draft</span>
    </div>
  )
}
