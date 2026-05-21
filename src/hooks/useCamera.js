import { useEffect, useState, useCallback } from 'react'

export default function useCamera(videoRef) {
  const [streamError, setStreamError] = useState(null)
  const [facingMode, setFacingMode] = useState('user')

  const toggleCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }, [])

  useEffect(() => {
    let stream = null

    async function startCamera() {
      try {
        // Stop previous stream
        if (videoRef.current?.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop())
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
        setStreamError(null)
      } catch (err) {
        console.error('Camera access error:', err)
        setStreamError(err.name === 'NotAllowedError'
          ? 'Camera permission denied.'
          : err.message || 'Failed to access camera.')
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [videoRef, facingMode])

  return { streamError, facingMode, toggleCamera }
}
