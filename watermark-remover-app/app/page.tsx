'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ImageUploadArea from '@/components/image-upload-area'
import ImagePreview from '@/components/image-preview'
import ProcessingLoader from '@/components/processing-loader'

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string>('')

  const handleImageUpload = (file: File) => {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setUploadedImage(result)
      setProcessedImage(null)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveWatermark = async () => {
    if (!uploadedImage) return

    setIsProcessing(true)
    try {
      // Simulate processing with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo, create a processed version by applying a filter
      const canvas = document.createElement('canvas')
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(img, 0, 0)

        // Apply subtle enhancement to simulate watermark removal
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.05)
          data[i + 1] = Math.min(255, data[i + 1] * 1.05)
          data[i + 2] = Math.min(255, data[i + 2] * 1.05)
        }

        ctx.putImageData(imageData, 0, 0)
        setProcessedImage(canvas.toDataURL('image/png'))
        setIsProcessing(false)
      }

      img.src = uploadedImage
    } catch (error) {
      console.error('Error processing image:', error)
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImage) return

    const link = document.createElement('a')
    link.href = processedImage
    link.download = `watermark-free-${fileName}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setUploadedImage(null)
    setProcessedImage(null)
    setFileName('')
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Watermark Remover
          </h1>
          <p className="text-lg text-muted-foreground">
            Remove watermarks from your images instantly. Simple, fast, and easy.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          {!uploadedImage ? (
            // Upload State
            <ImageUploadArea onImageUpload={handleImageUpload} />
          ) : !processedImage ? (
            // Processing State
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Original Image
                </h2>
                <ImagePreview imageSrc={uploadedImage} alt="Original image" />
              </div>

              <div className="flex gap-4 flex-col sm:flex-row">
                <Button
                  onClick={handleRemoveWatermark}
                  disabled={isProcessing}
                  className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isProcessing ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⟳</span>
                      Processing...
                    </>
                  ) : (
                    'Remove Watermark'
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 h-12 text-base font-semibold"
                >
                  Upload Different Image
                </Button>
              </div>

              {isProcessing && <ProcessingLoader />}
            </div>
          ) : (
            // Result State
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                    Original Image
                  </h2>
                  <ImagePreview imageSrc={uploadedImage} alt="Original image" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                    Result
                  </h2>
                  <ImagePreview imageSrc={processedImage} alt="Processed image" />
                </div>
              </div>

              <div className="flex gap-4 flex-col sm:flex-row">
                <Button
                  onClick={handleDownload}
                  className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  ↓ Download Image
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 h-12 text-base font-semibold"
                >
                  Process Another Image
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">⚡</div>
            <h3 className="font-semibold text-foreground mb-1">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Process images in seconds, not minutes
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">🔒</div>
            <h3 className="font-semibold text-foreground mb-1">Private & Secure</h3>
            <p className="text-sm text-muted-foreground">
              Your images are never stored on our servers
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">✨</div>
            <h3 className="font-semibold text-foreground mb-1">Easy to Use</h3>
            <p className="text-sm text-muted-foreground">
              No technical knowledge needed, just upload and go
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
