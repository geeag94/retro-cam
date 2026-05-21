const MODES = [
  { key: 'normal', label: 'NORMAL' },
  { key: 'grayscale', label: 'GRAYSCALE' },
  { key: 'sepia', label: 'SEPIA' },
]

export default function ControlPanel({ filterMode, onChange }) {
  return (
    <div className="flex gap-3">
      {MODES.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`
            px-4 py-2 border-2 text-sm font-retro tracking-wider transition-colors
            ${
              filterMode === key
                ? 'border-white bg-white text-black'
                : 'border-white/30 text-white/70 hover:border-white/60'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
