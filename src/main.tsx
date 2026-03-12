import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './ga4-bootstrap.ts'
import './styles/globals.css'
import App from './App.tsx'
import { TonalZoneProvider } from '@/context/TonalZoneContext'

const app = (
  <StrictMode>
    <TonalZoneProvider>
      <App />
    </TonalZoneProvider>
  </StrictMode>
)

const rootElement = document.getElementById('root')!

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
