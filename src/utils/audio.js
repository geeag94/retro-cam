export function playShutterSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioContext()

    // 1. White noise burst ("찰" - shutter blade opening)
    const bufferSize = ctx.sampleRate * 0.1
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1)
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    // Bandpass filter for realistic camera shutter tone
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2500
    filter.Q.value = 0.5

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.8, ctx.currentTime)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(ctx.destination)

    noise.start(ctx.currentTime)
    noise.stop(ctx.currentTime + 0.08)

    // 2. Mechanical spring sound ("칵" - mirror/slap mechanism)
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15)

    const oscFilter = ctx.createBiquadFilter()
    oscFilter.type = 'lowpass'
    oscFilter.frequency.value = 800

    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0, ctx.currentTime)
    oscGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02)
    oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18)

    osc.connect(oscFilter)
    oscFilter.connect(oscGain)
    oscGain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)

    // 3. Short resonance/click tail
    const clickOsc = ctx.createOscillator()
    clickOsc.type = 'square'
    clickOsc.frequency.setValueAtTime(1200, ctx.currentTime + 0.05)
    clickOsc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12)

    const clickGain = ctx.createGain()
    clickGain.gain.setValueAtTime(0, ctx.currentTime)
    clickGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.06)
    clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

    clickOsc.connect(clickGain)
    clickGain.connect(ctx.destination)

    clickOsc.start(ctx.currentTime + 0.05)
    clickOsc.stop(ctx.currentTime + 0.18)

  } catch (e) {
    console.warn('Audio playback failed:', e)
  }
}
