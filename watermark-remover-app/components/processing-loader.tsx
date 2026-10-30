export default function ProcessingLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-16 h-16 mb-4">
        {/* Outer spinning circle */}
        <div className="absolute inset-0 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin"></div>

        {/* Middle spinning circle */}
        <div className="absolute inset-2 border-4 border-transparent border-b-primary border-l-primary rounded-full animate-spin" style={{
          animationDirection: 'reverse',
          animationDuration: '1.5s'
        }}></div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          ⚙️
        </div>
      </div>

      <p className="text-center text-muted-foreground font-medium">
        Removing watermark...
      </p>
      <p className="text-center text-sm text-muted-foreground mt-2">
        This usually takes a few seconds
      </p>
    </div>
  )
}
