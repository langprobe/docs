/**
 * Aurora — fixed, non-interactive backdrop for the marketing landing page.
 *
 * Two layered effects, ported from the philadelphia landing mock
 * (missoula/index.html, lines ~44-45):
 *  1. A faint 72px grid (structure, "instrumented" feel), masked to fade
 *     out toward the bottom of the first viewport.
 *  2. A soft radial aurora glow in the brand accent color, positioned above
 *     the viewport so only its lower half is visible.
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
            'linear-gradient(rgba(10,10,10,0.028) 1px, transparent 1px), ' +
            'linear-gradient(90deg, rgba(10,10,10,0.028) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 1250px)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, transparent 1250px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -340,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1400,
          height: 880,
          background:
            'radial-gradient(ellipse at center, rgba(4,133,247,0.12) 0%, rgba(4,133,247,0.045) 42%, transparent 68%)',
        }}
      />
    </div>
  );
}
