import { useRef, useState } from 'react'
import styles from './AudioPlayer.module.css'

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = async () => {
    if (!audioRef.current) return

    const { gsap } = await import('gsap')
    const audio = audioRef.current

    if (isPlaying) {
      // Fade out and pause
      gsap.to(audio, {
        volume: 0,
        duration: 2,
        ease: 'power2.inOut',
        onComplete: () => {
          audio.pause()
          setIsPlaying(false)
        }
      })
    } else {
      // Fade in and play
      audio.volume = 0
      audio.play().catch(() => {
        console.warn('Audio playback requires user interaction first.')
      })
      setIsPlaying(true)
      gsap.to(audio, {
        volume: 0.4, // Set to a comfortable background level
        duration: 2,
        ease: 'power2.inOut'
      })
    }
  }

  return (
    <div className={styles.container}>
      <audio
        ref={audioRef}
        src="/assets/audio/vibe-track.mp3"
        loop
        preload="auto"
      />
      
      <button 
        className={styles.toggle} 
        onClick={togglePlay}
        aria-label={isPlaying ? 'Mute Vibe' : 'Enable Vibe'}
      >
        <span className={styles.label}>
          {isPlaying ? 'Vibe On' : 'Vibe Off'}
        </span>
        
        <div className={styles.visualizer}>
          <div className={[styles.bar, isPlaying ? styles.playing : ''].join(' ')} />
          <div className={[styles.bar, isPlaying ? styles.playing : ''].join(' ')} />
          <div className={[styles.bar, isPlaying ? styles.playing : ''].join(' ')} />
        </div>
      </button>
    </div>
  )
}
