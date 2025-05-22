import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './i18n/i18n'
import './index.css'
import './responsive.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-loading-skeleton/dist/skeleton.css'
import App from './App'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
