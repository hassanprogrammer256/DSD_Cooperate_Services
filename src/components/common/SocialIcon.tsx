// lucide-react 1.x ships no branded social icons at all (dropped for trademark
// reasons) — these hand-rolled equivalents draw only their glyph in currentColor with
// no self-contained background; callers own the background treatment (e.g. Footer's
// circular badge).
type IconProps = {
  size?: number;
  className?: string;
};

export function FacebookIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15 8.5h2.25V5.25h-2.25c-2.07 0-3.75 1.68-3.75 3.75v2H9v3.25h2.25V21h3.25v-6.75h2.25l.75-3.25h-3V9c0-.28.22-.5.5-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" fill="currentColor" opacity="0" />
      <circle cx="6.5" cy="7" r="1.6" fill="currentColor" />
      <rect x="5.3" y="10" width="2.4" height="10" fill="currentColor" />
      <path
        d="M10.5 10h2.3v1.4c.6-.9 1.6-1.6 3.1-1.6 2.3 0 3.6 1.5 3.6 4.3V20h-2.4v-5.4c0-1.4-.5-2.3-1.8-2.3-1 0-1.6.7-1.8 1.3-.1.2-.1.5-.1.8V20h-2.4l-.1-.1V10Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function XIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

export function WhatsappIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.5a8.4 8.4 0 0 0-7.2 12.7L4 20.5l4.4-.8A8.4 8.4 0 1 0 12 3.5Z"
        stroke="currentColor"
        strokeWidth={1.8}
      />
      <path
        d="M9 9.3c.1-.5.5-1.3 1-1.3.3 0 .6 0 .8.1.2 0 .4 0 .6.5.2.5.6 1.5.6 1.6.1.1.1.3 0 .4-.1.2-.1.3-.3.4-.1.2-.3.3-.4.5-.2.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1.9 1.9 1.2 2.2 1.3.3.1.5.1.6-.1.2-.2.7-.8.9-1 .2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.2.1.4.2.4.3.1.4.1.8-.1 1.2-.2.4-1.1 1-1.9 1.1-.5.1-1.2.1-3.6-.8-3-1.2-4.9-4.2-5-4.4-.1-.2-1-1.4-1-2.6 0-1.3.6-1.9.9-2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}
