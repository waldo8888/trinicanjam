import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { TonalZoneProvider } from '@/context/TonalZoneContext'

const heroShell = document.getElementById('hero-shell')

if (heroShell) {
  const removeHeroShell = () => {
    heroShell.remove()
  }

  window.addEventListener('trinicanjam:hero-ready', removeHeroShell, { once: true })
  window.setTimeout(removeHeroShell, 4000)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonalZoneProvider>
      <App />
    </TonalZoneProvider>
  </StrictMode>,
)
