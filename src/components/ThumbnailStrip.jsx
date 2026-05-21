export default function ThumbnailStrip({ captures, onThumbnailClick }) {
  if (captures.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3 overflow-x-auto hide-scrollbar px-4 py-2 bg-black/60 border border-white/10 rounded">
      {captures.map((src, index) => (
        <button
          key={`${src}-${index}`}
          onClick={() => onThumbnailClick(src, index)}
          className="w-20 h-14 bg-black border border-white/30 overflow-hidden flex-shrink-0 hover:border-white/80 transition-colors"
        >
          <img src={src} alt={`Capture ${index + 1}`} className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  )
}
