export default function FlashEffect({ isActive }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none z-40 bg-white transition-opacity duration-200 ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}
