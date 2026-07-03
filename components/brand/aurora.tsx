/**
 * Aurora — fixed, non-interactive backdrop for the marketing landing page.
 *
 * Two layered effects, ported from the philadelphia landing mock:
 *  1. A faint 72px grid (structure, "instrumented" feel).
 *  2. A soft radial aurora glow in the brand accent color, positioned in the
 *     upper half of the viewport.
 *
 * Intended for the landing page only — do not mount inside the docs shell.
 */
export function Aurora() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, var(--border) 1px, transparent 1px), ' +
            'linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          opacity: 0.5,
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1200px',
          height: '600px',
          background:
            'radial-gradient(closest-side, rgba(4,133,247,0.16), rgba(4,133,247,0.06) 55%, transparent 75%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}
