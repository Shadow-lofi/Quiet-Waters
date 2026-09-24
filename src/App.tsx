import { lazy, Suspense, type ComponentType } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { RouteFallback } from './components/RouteFallback'
import { Landing } from './pages/Landing'
import { Meditate } from './pages/Meditate'

// The shell (AppLayout), the public front door (Landing), and the primary app
// screen (Meditate — also the catch-all target) load eagerly so first paint is
// instant. Every other screen is split into its own chunk and loaded on demand,
// keeping the initial bundle small. The service worker precaches every emitted
// chunk (see stamp-sw in vite.config.ts), so all routes still work fully offline
// once installed — the split trades nothing away there.
const lazyPage = <T extends Record<string, unknown>, K extends keyof T>(
  load: () => Promise<T>,
  name: K,
) => lazy(() => load().then((m) => ({ default: m[name] as ComponentType })))

const Churches = lazyPage(() => import('./pages/Churches'), 'Churches')
const ChurchesFlyer = lazyPage(() => import('./pages/ChurchesFlyer'), 'ChurchesFlyer')
const ChurchesSlide = lazyPage(() => import('./pages/ChurchesSlide'), 'ChurchesSlide')
const Privacy = lazyPage(() => import('./pages/Privacy'), 'Privacy')
const Contact = lazyPage(() => import('./pages/Contact'), 'Contact')
const Journey = lazyPage(() => import('./pages/Journey'), 'Journey')
const Prayers = lazyPage(() => import('./pages/Prayers'), 'Prayers')
const Settings = lazyPage(() => import('./pages/Settings'), 'Settings')
const Updates = lazyPage(() => import('./pages/Updates'), 'Updates')
const Notifications = lazyPage(() => import('./pages/Notifications'), 'Notifications')
const Study = lazyPage(() => import('./pages/Study'), 'Study')
const LastDays = lazyPage(() => import('./pages/LastDays'), 'LastDays')
const SevenChurches = lazyPage(() => import('./pages/SevenChurches'), 'SevenChurches')
const TenVirgins = lazyPage(() => import('./pages/TenVirgins'), 'TenVirgins')
const FeastOfTrumpets = lazyPage(() => import('./pages/FeastOfTrumpets'), 'FeastOfTrumpets')
const SevenBowls = lazyPage(() => import('./pages/SevenBowls'), 'SevenBowls')
const Lectio = lazyPage(() => import('./pages/Lectio'), 'Lectio')
const Hymns = lazyPage(() => import('./pages/Hymns'), 'Hymns')
const KidsStudy = lazyPage(() => import('./pages/KidsStudy'), 'KidsStudy')
const Encourage = lazyPage(() => import('./pages/Encourage'), 'Encourage')
const Bible = lazyPage(() => import('./pages/Bible'), 'Bible')
const EnochStudy = lazyPage(() => import('./pages/EnochStudy'), 'EnochStudy')
const Memory = lazyPage(() => import('./pages/Memory'), 'Memory')
const Devotional = lazyPage(() => import('./pages/Devotional'), 'Devotional')
const DevotionalSeries = lazyPage(() => import('./pages/DevotionalSeries'), 'DevotionalSeries')
const Guide = lazyPage(() => import('./pages/Guide'), 'Guide')

export default function App() {
  return (
    <BrowserRouter>
      {/* Fallback for the standalone (non-layout) lazy routes below. Routes under
          AppLayout have their own Suspense around the Outlet, so switching tabs
          keeps the shell in place while the next chunk loads. */}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public landing / SEO front door (returning visitors auto-continue). */}
          <Route path="/" element={<Landing />} />
          {/* Outreach pages for church & group leaders — standalone, no tab bar. */}
          <Route path="/churches" element={<Churches />} />
          <Route path="/churches/flyer" element={<ChurchesFlyer />} />
          <Route path="/churches/slide" element={<ChurchesSlide />} />
          {/* Privacy policy & contact — standalone, linkable from Settings and the Play listing. */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          {/* The app itself lives under the bottom-tab layout. */}
          <Route element={<AppLayout />}>
            <Route path="/meditate" element={<Meditate />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/prayers" element={<Prayers />} />
            <Route path="/study" element={<Study />} />
            <Route path="/last-days" element={<LastDays />} />
            <Route path="/seven-churches" element={<SevenChurches />} />
            <Route path="/ten-virgins" element={<TenVirgins />} />
            <Route path="/feast-of-trumpets" element={<FeastOfTrumpets />} />
            <Route path="/seven-bowls" element={<SevenBowls />} />
            <Route path="/lectio" element={<Lectio />} />
            <Route path="/hymns" element={<Hymns />} />
            <Route path="/kids" element={<KidsStudy />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="/devotional" element={<Devotional />} />
            <Route path="/devotional/:id" element={<DevotionalSeries />} />
            <Route path="/encourage" element={<Encourage />} />
            <Route path="/bible" element={<Bible />} />
            <Route path="/enoch" element={<EnochStudy />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          <Route path="*" element={<Navigate to="/meditate" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
