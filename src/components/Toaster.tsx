import { Bell, CheckCircle2, Sparkles, X } from 'lucide-react'
import { useToast, type ToastTone } from '../lib/toast'

const toneStyles: Record<ToastTone, { ring: string; icon: React.ReactNode }> = {
  default: { ring: 'border-l-deep-500', icon: <Bell size={18} className="text-deep-600" /> },
  success: { ring: 'border-l-reed-500', icon: <CheckCircle2 size={18} className="text-reed-500" /> },
  water: { ring: 'border-l-water-500', icon: <Sparkles size={18} className="text-water-600" /> },
}

/** Renders the gentle toast queue. Mounted once in AppLayout. */
export function Toaster() {
  const toasts = useToast((s) => s.toasts)
  const dismiss = useToast((s) => s.dismiss)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex flex-col items-center gap-2.5 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:top-auto sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`qw-toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-l-4 border-line ${toneStyles[t.tone].ring} bg-card px-4 py-3.5 shadow-xl`}
        >
          <span className="mt-0.5 shrink-0">{toneStyles[t.tone].icon}</span>
          <div className="min-w-0 flex-1">
            <p className="font-medium leading-tight text-deep-900">{t.title}</p>
            {t.message && <p className="mt-0.5 text-sm text-deep-500">{t.message}</p>}
            {t.action && (
              <button
                onClick={() => {
                  t.action?.onClick()
                  dismiss(t.id)
                }}
                className="mt-2 rounded-full bg-mist-200 px-3 py-1 text-xs font-semibold text-deep-800 transition hover:bg-mist-300"
              >
                {t.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="shrink-0 rounded-full p-1 text-deep-400 transition hover:bg-mist-200 hover:text-deep-700"
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  )
}
