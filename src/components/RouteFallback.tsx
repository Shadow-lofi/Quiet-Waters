import { Loader2 } from 'lucide-react'

/**
 * A quiet placeholder shown while a lazily-loaded route chunk arrives. Kept
 * minimal and centered so route transitions feel calm rather than janky. Once a
 * chunk has loaded (or been precached by the service worker for offline), the
 * route renders instantly and this is never seen again.
 */
export function RouteFallback() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-label="Loading">
      <Loader2 size={24} className="animate-spin text-water-500" />
    </div>
  )
}
