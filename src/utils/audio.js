const SHUTTER_SOUND_URL = '/shutter.wav'

export function playShutterSound() {
  try {
    const audio = new Audio(SHUTTER_SOUND_URL)
    audio.volume = 1.0
    audio.play().catch(err => {
      console.warn('Shutter sound playback failed:', err)
    })
  } catch (e) {
    console.warn('Audio creation failed:', e)
  }
}
