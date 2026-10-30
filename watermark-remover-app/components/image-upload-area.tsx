'use client'

import { useRef } from 'react'

interface ImageUploadAreaProps {
  onImageUpload: (file: File) => void
}

export default function ImageUploadArea({ onImageUpload }: ImageUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-primary', 'bg-primary/5')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5')

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        onImageUpload(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageUpload(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Step 1: Upload Your Image</h2>
        <p className="text-muted-foreground">
          Select an image with a watermark to get started
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer transition-colors duration-200 hover:border-primary/50 hover:bg-primary/2.5"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload image"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl">📁</div>
          <div>
            <p className="text-lg font-semibold text-foreground mb-1">
              Drag and drop your image here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse your files (JPG, PNG, WebP, etc.)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
