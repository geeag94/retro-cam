export function playShutterSound() {
  try {
    // iOS Safari works best with native Audio element inside user gesture
    const audio = new Audio('./shutter.mp3')
    audio.volume = 1.0
    
    // Some browsers return a promise from play()
    const playPromise = audio.play()
    
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Audio play failed:', err)
      })
    }
  } catch (e) {
    console.warn('Audio creation failed:', e)
  }
}
