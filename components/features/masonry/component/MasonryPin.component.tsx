import { useState } from 'react'
import { LayoutPin } from '../helper/MasonryLayoutEngine'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MasonryPinComponentProps {
  pin: LayoutPin
  isRevealed: boolean
  onImageSettled: () => void
}

export const MasonryPinComponent = ({
  pin,
  isRevealed,
  onImageSettled,
}: MasonryPinComponentProps) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  return (
    <div
      className="absolute overflow-hidden rounded-[16px] bg-panel transition-[left,top,width] duration-300"
      key={pin.id}
      style={{
        height: pin.height,
        left: pin.left,
        top: pin.top,
        width: pin.width,
      }}
    >
      <Image
        alt={pin.alt}
        className={`h-full w-full object-cover ${isRevealed ? 'opacity-100' : 'opacity-0'}`}
        src={pin.url}
        sizes={`${Math.ceil(pin.width)}px`}
        fill
        onLoad={async (event) => {
          const image = event.currentTarget
          await image.decode().catch(() => {})
          requestAnimationFrame(() => {
            onImageSettled()
          })
        }}
        onError={() => {
          setStatus('error')
          onImageSettled()
        }}
      />
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-[#cbd5e1] transition-opacity duration-200',
          !isRevealed
            ? 'opacity-100 animate-pulse z-10'
            : 'pointer-events-none opacity-0'
        )}
      />
      {status === 'error' && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-panel text-sm text-muted">
          Image unavailable
        </div>
      )}
    </div>
  )
}
