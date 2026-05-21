import { useState, useEffect } from 'react'

export default function useClock() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    function update() {
      const now = new Date()
      const yyyy = now.getFullYear()
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      const hours = now.getHours()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const hh = String(hours % 12 || 12).padStart(2, '0')
      const min = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      setCurrentTime(`${yyyy}.${mm}.${dd} ${ampm} ${hh}:${min}:${ss}`)
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return { currentTime }
}
