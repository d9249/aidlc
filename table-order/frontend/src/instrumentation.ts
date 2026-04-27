// Node.js v25+ exposes a broken localStorage global (getItem is undefined).
// Delete it so server-side code doesn't accidentally use it.
if (typeof window === "undefined" && typeof localStorage !== "undefined") {
  delete (globalThis as Record<string, unknown>).localStorage;
}

export function register() {
  // intentionally empty — side-effect import above is sufficient
}
