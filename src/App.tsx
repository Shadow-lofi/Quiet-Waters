import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { Meditate } from './pages/Meditate'
import { Journey } from './pages/Journey'
import { Settings } from './pages/Settings'
import { Updates } from './pages/Updates'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Meditate />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/updates" element={<Updates />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
