export default function CameraSwitchButton({ onClick, facingMode }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 border-2 border-white/30 text-white/70 text-sm font-retro tracking-wider
                 hover:border-white/60 hover:text-white transition-colors"
    >
      {facingMode === 'user' ? '📷 FRONT' : '📷 REAR'}
    </button>
  )
}
