// ── BottomSheet.jsx ──────────────────────────────────────────────────────────
// Slide-up panel used for both the global "how to play" help screen and
// per-card event info. Renders a semi-transparent backdrop that closes the
// sheet on click, plus the panel itself which animates in from the bottom.
//
// Props:
//   open     - whether the sheet is currently visible
//   onClose  - called when backdrop or the ✕ button is clicked
//   children - content rendered inside the panel body
//
// Design decision: the sheet is always rendered in the DOM (not conditional)
// so the close animation plays smoothly before the component unmounts.
// open/closed state is communicated purely through the 'open' CSS class.
// ────────────────────────────────────────────────────────────────────────────

export function BottomSheet({ open, onClose, children }) {
  return (
    <>
      {/* Backdrop - darkens content behind the sheet and catches close clicks */}
      <div
        className={`sheet-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
      />

      <div
        className={`bottom-sheet${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drag pill - visual affordance that the sheet slides up/down */}
        <div className="sheet-pill" />

        {/* Close button in top-right corner of the panel */}
        <button className="sheet-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}
