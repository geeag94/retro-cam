import { useState, useRef, useCallback } from 'react'
import CameraView from './components/CameraView'
import RecOverlay from './components/RecOverlay'
import ControlPanel from './components/ControlPanel'
import CameraSwitchButton from './components/CameraSwitchButton'
import ShutterButton from './components/ShutterButton'
import FlashEffect from './components/FlashEffect'
import ThumbnailStrip from './components/ThumbnailStrip'
import useCamera from './hooks/useCamera'
import useClock from './hooks/useClock'
import { captureImage } from './utils/capture'
import { playShutterSound } from './utils/audio'

function App() {
  const [captures, setCaptures] = useState([])
  const [filterMode, setFilterMode] = useState('normal')
  const [isFlashing, setIsFlashing] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(document.createElement('canvas'))

  const { streamError, facingMode, toggleCamera } = useCamera(videoRef)
  const { currentTime } = useClock()

  const handleCapture = useCallback(() => {
    if (!videoRef.current) return

    // 1. Play shutter sound
    playShutterSound()

    // 2. Trigger flash effect
    setIsFlashing(true)
    setTimeout(() => setIsFlashing(false), 200)

    // 3. Capture image
    const dataUrl = captureImage(videoRef.current, canvasRef.current, filterMode)

    // 4. Trigger download
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0]
    link.download = `capture_${timestamp}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 5. Update thumbnails (FIFO, max 4)
    setCaptures(prev => {
      const next = [dataUrl, ...prev]
      if (next.length > 4) next.pop()
      return next
    })
  }, [filterMode])

  const handleThumbnailClick = useCallback((dataUrl, index) => {
    const link = document.createElement('a')
    link.download = `capture_thumbnail_${index + 1}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  if (streamError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-8">
        <h1 className="text-4xl text-red-500 mb-4 font-retro">CAMERA ERROR</h1>
        <p className="text-xl text-gray-400 font-retro">{streamError}</p>
        <p className="text-lg text-gray-500 mt-4 font-retro">Please allow camera access and refresh.</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-[#111] flex flex-col items-center justify-center overflow-hidden">
      {/* Camera View with Scanlines & Viewfinder */}
      <div className="relative w-full max-w-4xl aspect-video bg-black">
        <CameraView videoRef={videoRef} filterMode={filterMode} />
        <RecOverlay currentTime={currentTime} />
        <FlashEffect isActive={isFlashing} />
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col items-center gap-4 z-10">
        <div className="flex gap-3 items-center">
          <ControlPanel filterMode={filterMode} onChange={setFilterMode} />
          <CameraSwitchButton facingMode={facingMode} onClick={toggleCamera} />
        </div>
        <ShutterButton onClick={handleCapture} />
      </div>

      {/* Thumbnails */}
      <ThumbnailStrip captures={captures} onThumbnailClick={handleThumbnailClick} />
    </div>
  )
}

export default App
