/// <reference types="vite/client" />

declare const __APP_VERSION__: string
declare const __BUILD_TIME__: string

interface ImportMetaEnv {
  /** VAPID public key for web push; overrides the default embedded in lib/push.ts. */
  readonly VITE_VAPID_PUBLIC_KEY?: string
  /** Set to '1' to reveal the push-notification opt-in once the backend is wired. */
  readonly VITE_PUSH_ENABLED?: string
}
