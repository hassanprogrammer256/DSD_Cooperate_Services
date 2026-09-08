import { Link } from "react-router-dom";

export function CtaStrip() {
  return (
    <div className="bg-primary">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 text-center sm:flex-row sm:text-left md:px-6">
        <p className="text-sm font-medium text-white">Not sure where to start? Request a call back — no obligation.</p>
        <Link
          to="/contact"
          className="shrink-0 rounded-md border border-white/50 px-4 py-2 text-sm font-semibold text-white hover:border-white"
        >
          Request a Call Back
        </Link>
      </div>
    </div>
  );
}
