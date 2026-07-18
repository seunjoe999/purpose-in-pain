/**
 * Purpose In Pain Initiative logo. The "P" mark is a raster crop (transparent
 * background) taken from the client's own campaign artwork (source:
 * WhatsApp-shared "mission statement" graphic) — swap for the client's real
 * vector logo file once they provide one (see README "Placeholders / TODO").
 * The wordmark is set as text (not baked into the image) so its color can
 * adapt to light and dark backgrounds (e.g. the dark footer).
 */
export default function Logo({ withWordmark = true, className = '' }: { withWordmark?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/assets/brand/logo-mark.png"
        alt={withWordmark ? '' : 'Purpose In Pain Initiative'}
        aria-hidden={withWordmark}
        className="h-9 w-auto sm:h-10"
      />
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
