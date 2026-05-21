export default function RecOverlay({ currentTime }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Top-left: REC indicator */}
      <div className="absolute top-4 left-12 flex items-center gap-2">
        <span className="text-red-500 text-2xl animate-blink">●</span>
        <span className="text-red-500 text-xl font-retro tracking-widest">REC</span>
      </div>

      {/* Top-right: Static camera info */}
      <div className="absolute top-4 right-12 flex flex-col items-end gap-1 text-white/70 text-sm font-retro">
        <span>ISO 800</span>
        <span>4K 24FPS</span>
        <span>🔋 87%</span>
        <span>AWB</span>
      </div>

      {/* Bottom: Live clock */}
      <div className="absolute bottom-4 left-12 text-white text-lg font-retro">
        {currentTime}
      </div>
    </div>
  )
}
