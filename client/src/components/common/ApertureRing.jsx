/**
 * The page's signature decorative motif: concentric rings evoking a
 * camera/lens aperture or a spectacle lens edge. Used once, boldly,
 * behind the homepage hero headline — purely decorative (aria-hidden),
 * built from plain circles rather than an imported image or gradient.
 */
export default function ApertureRing({ className = "" }) {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={className}
    >
      <circle cx="200" cy="200" r="198" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
      <circle cx="200" cy="200" r="95" fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
