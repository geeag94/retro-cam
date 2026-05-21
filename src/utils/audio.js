// NOTE: Place your shutter sound file (e.g., shutter.mp3) in the public/ folder
// and update the path below to '/shutter.mp3' before using.
const SHUTTER_SOUND_URL = '' // e.g., '/shutter.mp3'

export function playShutterSound() {
  if (!SHUTTER_SOUND_URL) {
    // Fallback: use a short synthesized beep if no file is provided
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.1)
    } catch (e) {
      console.warn('Audio playback failed:', e)
    }
    return
  }

  const audio = new Audio(SHUTTER_SOUND_URL)
  audio.play().catch(err => console.warn('Shutter sound playback failed:', err))
}
