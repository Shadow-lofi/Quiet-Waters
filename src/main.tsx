import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
// Self-hosted variable fonts so first paint never waits on a CDN and the app
// works fully offline. Newsreader (with italic) for Scripture; Nunito Sans for UI.
import '@fontsource-variable/nunito-sans'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/newsreader/wght-italic.css'
import './index.css'
import App from './App'
import { ThemeProvider } from './components/ThemeProvider'
import { registerServiceWorker } from './lib/swUpdate'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider />
    <App />
    <Analytics />
  </StrictMode>,
)

if (import.meta.env.PROD) registerServiceWorker()
