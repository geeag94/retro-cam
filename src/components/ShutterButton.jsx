export default function ShutterButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative w-20 h-20 rounded-full border-4 border-white/80 bg-white/10 flex items-center justify-center
                 hover:bg-white/20 active:scale-95 transition-transform duration-100"
      aria-label="Shutter"
    >
      <div className="w-14 h-14 rounded-full border-2 border-red-500 bg-red-500/80" />
      <span className="absolute -bottom-8 text-white/70 text-xs font-retro tracking-widest">SHUTTER</span>
    </button>
  )
}
