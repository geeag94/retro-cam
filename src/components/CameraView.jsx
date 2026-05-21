export default function CameraView({ videoRef, filterMode }) {
  const filterClass =
    filterMode === 'grayscale'
      ? 'grayscale'
      : filterMode === 'sepia'
      ? 'sepia'
      : ''

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${filterClass}`}
      />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-40 z-10" />

      {/* Viewfinder corners */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Top-left */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/80" />
        {/* Top-right */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/80" />
        {/* Bottom-left */}
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/80" />
        {/* Bottom-right */}
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/80" />
      </div>
    </div>
  )
}
