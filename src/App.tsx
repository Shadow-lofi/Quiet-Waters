import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { Landing } from './pages/Landing'
import { Churches } from './pages/Churches'
import { ChurchesFlyer } from './pages/ChurchesFlyer'
import { ChurchesSlide } from './pages/ChurchesSlide'
import { Meditate } from './pages/Meditate'
import { Journey } from './pages/Journey'
import { Settings } from './pages/Settings'
import { Updates } from './pages/Updates'
import { Notifications } from './pages/Notifications'
import { Study } from './pages/Study'
import { Bible } from './pages/Bible'
import { EnochStudy } from './pages/EnochStudy'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing / SEO front door (returning visitors auto-continue). */}
        <Route path="/" element={<Landing />} />
        {/* Outreach pages for church & group leaders — standalone, no tab bar. */}
        <Route path="/churches" element={<Churches />} />
        <Route path="/churches/flyer" element={<ChurchesFlyer />} />
        <Route path="/churches/slide" element={<ChurchesSlide />} />
        {/* The app itself lives under the bottom-tab layout. */}
        <Route element={<AppLayout />}>
          <Route path="/meditate" element={<Meditate />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/study" element={<Study />} />
          <Route path="/bible" element={<Bible />} />
          <Route path="/enoch" element={<EnochStudy />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Navigate to="/meditate" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
