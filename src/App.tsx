import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

type AppState = 'idle' | 'counting' | 'launched'

const LOOP_COLORS = ['#9cb4db', '#8aa68a', '#9cb4db'];

function App() {
  const [state, setState] = useState<AppState>('idle')
  const [count, setCount] = useState(10)
  const videoRef = useRef<HTMLVideoElement>(null)
  const confettiIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    let timer: number
    if (state === 'counting' && count > 0) {
      timer = window.setTimeout(() => setCount(count - 1), 1000)
    } else if (state === 'counting' && count === 0) {
      triggerLaunch()
    }
    return () => clearTimeout(timer)
  }, [state, count])

  const triggerLaunch = () => {
    setState('launched')
    
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 }
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval = window.setInterval(function() {
      confetti({ ...defaults, particleCount: 40, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount: 40, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)
    
    confettiIntervalRef.current = interval

    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 200
    })

    setTimeout(() => {
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current)
        confettiIntervalRef.current = null
      }
    }, 2000)

    if (videoRef.current) {
      videoRef.current.play().catch(console.error)
    }
  }

  const handleLaunch = () => {
    setState('counting')
  }

  const currentColor = LOOP_COLORS[(10 - count) % LOOP_COLORS.length];

  return (
    <div className="app">
      <div className="video-container">
        <video 
          ref={videoRef}
          src="/videoplayback.mp4" 
          playsInline
        />
      </div>

      <div className={`curtain-container ${state === 'launched' ? 'curtains-open' : ''}`}>
        <div className="curtain curtain-left"></div>
        <div className="curtain curtain-right"></div>
      </div>

      <div className="ui-overlay">
        {state === 'idle' && (
          <div className="entrance-anim">
            <div className="logo-crop-container">
              <img src="/Vaji-Logo-GIF.gif" alt="Vaji Logo" className="vaji-logo" />
            </div>
            <h1 style={{ color: '#d4af37', marginBottom: '2rem', fontSize: '3rem', textShadow: '2px 2px 4px #000', fontFamily: 'serif' }}>
              Grand Inauguration
            </h1>
            <button className="launch-button" onClick={handleLaunch}>
              Launch Now
            </button>
            <div className="powered-by">
              <span>Powered by</span>
              <img src="/hippo.jpg" alt="Hippo Logo" className="hippo-logo" />
            </div>
          </div>
        )}
        
        {state === 'counting' && (
          <div className="countdown-container">
            {/* Premium SVG Stroke Animation specifically for Countdown */}
            <svg width="450" height="450" viewBox="0 0 100 100" style={{ position: 'absolute', zIndex: 1 }}>
              <circle 
                cx="50" cy="50" r="48" 
                fill="none" 
                stroke={currentColor} 
                strokeWidth="1" 
                strokeDasharray="301.6"
                strokeDashoffset={301.6 - (301.6 * (10 - count) / 10)}
                style={{ 
                  transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease', 
                  filter: `drop-shadow(0 0 15px ${currentColor})` 
                }}
              />
              <circle 
                cx="50" cy="50" r="48" 
                fill="none" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="0.5"
              />
            </svg>
            <div 
              key={count} 
              className="countdown-number" 
              style={{ color: currentColor }}
            >
              {count}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
