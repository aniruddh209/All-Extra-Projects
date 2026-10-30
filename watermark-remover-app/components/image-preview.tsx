'use client'

interface ImagePreviewProps {
  imageSrc: string
  alt: string
}

export default function ImagePreview({ imageSrc, alt }: ImagePreviewProps) {
  return (
    <div className="w-full bg-secondary rounded-lg overflow-hidden border border-border">
      <div className="relative w-full bg-muted aspect-video flex items-center justify-center">
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
}
