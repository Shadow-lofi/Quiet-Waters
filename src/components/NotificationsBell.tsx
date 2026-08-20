import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useNotifications } from '../lib/notifications'

/**
 * The doorway to the notifications inbox — a bell that wears a small count when
 * something is waiting. Lives in the home header; tapping it opens /notifications.
 */
export function NotificationsBell({ className = '' }: { className?: string }) {
  const count = useNotifications().length

  return (
    <Link
      to="/notifications"
      aria-label={count > 0 ? `Notifications, ${count} waiting` : 'Notifications'}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-card text-deep-600 shadow-sm ring-1 ring-line transition-colors hover:text-water-600 ${className}`}
    >
      <Bell size={18} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-water-500 px-1 text-[0.65rem] font-bold text-onwater">
          {count}
        </span>
      )}
    </Link>
  )
}
