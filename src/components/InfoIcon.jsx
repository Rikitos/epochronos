// ── InfoIcon.jsx ─────────────────────────────────────────────────────────────
// Inline SVG info icon — used in the header help button and on each event card.
// SVG guarantees crisp rendering at any size and any pixel density, unlike
// Unicode characters (ⓘ) which depend on system font glyph rendering.
//
// Props:
//   size — pixel dimension for both width and height (default 16)
// ────────────────────────────────────────────────────────────────────────────

export function InfoIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      {/* Dot above the stem */}
      <circle cx="8" cy="4.75" r="0.85" fill="currentColor" />
      {/* Vertical stem of the 'i' */}
      <rect x="7.25" y="7" width="1.5" height="4.75" rx="0.75" fill="currentColor" />
    </svg>
  );
}
