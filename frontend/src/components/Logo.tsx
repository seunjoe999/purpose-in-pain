/**
 * Inline SVG recreation of the "P with a heart" Purpose In Pain Initiative
 * logo mark, described in the content brief. No vector logo file was
 * supplied by the client — this is a PLACEHOLDER mark to be swapped for the
 * client's real logo file once available (see README "Placeholders / TODO").
 */
export default function Logo({ withWordmark = true, className = '' }: { withWordmark?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="38" height="38" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="44" height="44" rx="12" fill="#0B2A44" />
        <path
          d="M14 10.5C14 9.67 14.67 9 15.5 9H23C27.42 9 31 12.35 31 16.5C31 20.65 27.42 24 23 24H18.5V33.5C18.5 34.33 17.83 35 17 35H15.5C14.67 35 14 34.33 14 33.5V10.5Z"
          fill="#1BA8DE"
        />
        <path
          d="M18.5 13.5H22.7C24.66 13.5 26.25 15.02 26.25 16.9C26.25 18.78 24.66 20.3 22.7 20.3H18.5V13.5Z"
          fill="#0B2A44"
        />
        <path
          d="M22.6 15.55C23.02 15.05 23.75 14.98 24.24 15.38C24.75 15.79 24.83 16.53 24.42 17.04L22.6 19.25L20.78 17.04C20.37 16.53 20.45 15.79 20.96 15.38C21.45 14.98 22.18 15.05 22.6 15.55Z"
          fill="#EC1FA0"
        />
      </svg>
      {withWordmark && (
        <span className="leading-tight">
          <span className="block font-display text-sm font-extrabold tracking-tight text-navy-700 sm:text-base">
            PURPOSE IN PAIN
          </span>
          <span className="block font-display text-[10px] font-bold tracking-[0.2em] text-sky-500 sm:text-xs">
            INITIATIVE CIC
          </span>
        </span>
      )}
    </div>
  );
}
