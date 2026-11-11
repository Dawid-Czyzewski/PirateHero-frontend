const FIELD_ICON = "pointer-events-none absolute top-1/2 block h-auto text-[#f1f0ef] desk:hidden";

export function IconMail() {
  return (
    <svg className={`${FIELD_ICON} left-32 w-35 [transform:translateY(calc(-50%+1.6*var(--k)))]`} viewBox="0 0 34 26" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 0h28a3 3 0 0 1 3 3v1.2L17 15.6 0 4.2V3a3 3 0 0 1 3-3zM0 7.6l17 11.3L34 7.6V23a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3z"
      />
    </svg>
  );
}

export function IconLock() {
  return (
    <svg
      className={`${FIELD_ICON} left-35 w-29 [transform:translateY(-50%)]`}
      viewBox="0 0 29 38"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M14.5 0A9.5 9.5 0 0 1 24 9.5V15h1.5a3.5 3.5 0 0 1 3.5 3.5v16a3.5 3.5 0 0 1-3.5 3.5h-22A3.5 3.5 0 0 1 0 34.5v-16A3.5 3.5 0 0 1 3.5 15H5V9.5A9.5 9.5 0 0 1 14.5 0zm0 4.5a5 5 0 0 0-5 5V15h10V9.5a5 5 0 0 0-5-5zm0 17a3 3 0 0 0-1.6 5.5V31h3.2v-4A3 3 0 0 0 14.5 21.5z"
      />
    </svg>
  );
}

export function EyeOn() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinejoin="round"
        d="M2 18C6 12 11.5 9 18 9s12 3 16 9c-4 6-9.5 9-16 9S6 24 2 18z"
      />
      <circle cx="18" cy="18" r="5.6" fill="currentColor" />
    </svg>
  );
}

export function EyeOff() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinejoin="round"
        d="M2 18C6 12 11.5 9 18 9s12 3 16 9c-4 6-9.5 9-16 9S6 24 2 18z"
      />
      <circle cx="18" cy="18" r="5.6" fill="currentColor" />
      <path
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        d="M5 4l26 28"
      />
    </svg>
  );
}
