export function captureImage(video, canvas, filterMode) {
  if (!video || !canvas) return ''

  const ctx = canvas.getContext('2d')
  canvas.width = video.videoWidth || 1280
  canvas.height = video.videoHeight || 720

  // Apply CSS filter to canvas context
  let filterString = 'none'
  if (filterMode === 'grayscale') {
    filterString = 'grayscale(100%)'
  } else if (filterMode === 'sepia') {
    filterString = 'sepia(100%)'
  }

  ctx.filter = filterString
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  ctx.filter = 'none'

  return canvas.toDataURL('image/png')
}
