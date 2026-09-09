// Small shared bits for the guiding lamb (see components/LambHelper.tsx), kept in
// their own module so the component file only exports components (fast refresh).

// Routes where the lamb stays away. The full guide already *is* the lamb, so it
// would be redundant there. AppLayout reads this too, to size the top band.
export const LAMB_HELPER_HIDDEN_ON = ['/guide']

// The Bible reader wants the lamb centered at the top (its header has the title
// on the left and controls on the right, leaving the middle clear); everywhere
// else it sits top-left, opposite the notifications bell.
export function isLambCentered(path: string): boolean {
  return path === '/bible'
}
