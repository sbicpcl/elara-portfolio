import type { ArtKind } from "@/lib/projects";

type Props = {
  id: string;
  gradient: [string, string];
  art: ArtKind;
  image?: string;
  alt?: string;
  className?: string;
};

const W = "#ffffff";

/** A stylised app/product mockup for each project, drawn in white on the project's gradient. */
function Mockup({ art }: { art: ArtKind }) {
  // Phone frame for mobile-first work.
  if (art === "blobs") {
    return (
      <g>
        <rect x="150" y="34" width="140" height="252" rx="26" fill={W} opacity="0.1" />
        <rect x="150" y="34" width="140" height="252" rx="26" fill="none" stroke={W} strokeOpacity="0.28" />
        <rect x="196" y="46" width="48" height="7" rx="3.5" fill={W} opacity="0.35" />
        <rect x="166" y="70" width="108" height="60" rx="12" fill={W} opacity="0.22" />
        <rect x="178" y="84" width="52" height="9" rx="4.5" fill={W} opacity="0.5" />
        <rect x="178" y="102" width="82" height="16" rx="6" fill={W} opacity="0.75" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx="176" cy={158 + i * 34} r="9" fill={W} opacity="0.4" />
            <rect x="194" y={152 + i * 34} width="72" height="7" rx="3.5" fill={W} opacity="0.4" />
            <rect x="194" y={164 + i * 34} width="44" height="6" rx="3" fill={W} opacity="0.22" />
          </g>
        ))}
      </g>
    );
  }

  // Everything else: a floating "browser window".
  const win = (
    <>
      <rect x="44" y="42" width="312" height="236" rx="16" fill={W} opacity="0.1" />
      <rect x="44" y="42" width="312" height="236" rx="16" fill="none" stroke={W} strokeOpacity="0.26" />
      <circle cx="64" cy="62" r="4" fill={W} opacity="0.5" />
      <circle cx="78" cy="62" r="4" fill={W} opacity="0.35" />
      <circle cx="92" cy="62" r="4" fill={W} opacity="0.25" />
      <line x1="44" y1="82" x2="356" y2="82" stroke={W} strokeOpacity="0.18" />
    </>
  );

  switch (art) {
    case "chart":
      return (
        <g>
          {win}
          <polyline points="70,240 120,200 160,214 210,150 260,176 330,110" fill="none" stroke={W} strokeOpacity="0.8" strokeWidth="3" />
          <polyline points="70,240 120,200 160,214 210,150 260,176 330,110 330,258 70,258" fill={W} opacity="0.08" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={78 + i * 54} y={228 - i * 8} width="24" height={30 + i * 8} rx="4" fill={W} opacity="0.16" />
          ))}
        </g>
      );
    case "circles":
      return (
        <g>
          {win}
          <circle cx="118" cy="176" r="46" fill="none" stroke={W} strokeOpacity="0.2" strokeWidth="10" />
          <circle cx="118" cy="176" r="46" fill="none" stroke={W} strokeOpacity="0.85" strokeWidth="10" strokeLinecap="round" strokeDasharray="215 289" transform="rotate(-90 118 176)" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="192" y={150 + i * 26} width="120" height="8" rx="4" fill={W} opacity={0.5 - i * 0.12} />
              <rect x="192" y={162 + i * 26} width="70" height="6" rx="3" fill={W} opacity="0.2" />
            </g>
          ))}
        </g>
      );
    case "cards":
      return (
        <g>
          {win}
          {[0, 1, 2].map((c) =>
            [0, 1].map((r) => (
              <g key={`${c}-${r}`}>
                <rect x={70 + c * 94} y={98 + r * 84} width="78" height="70" rx="10" fill={W} opacity="0.16" />
                <rect x={70 + c * 94} y={98 + r * 84} width="78" height="42" rx="10" fill={W} opacity="0.12" />
                <rect x={80 + c * 94} y={148 + r * 84} width="44" height="6" rx="3" fill={W} opacity="0.4" />
              </g>
            ))
          )}
        </g>
      );
    case "grid":
      return (
        <g>
          {win}
          {[0, 1, 2, 3].map((c) =>
            [0, 1, 2].map((r) => (
              <rect key={`${c}-${r}`} x={70 + c * 70} y={100 + r * 52} width="54" height="38" rx="9" fill={W} opacity={0.1 + ((c + r) % 4) * 0.08} />
            ))
          )}
        </g>
      );
    case "waves":
      return (
        <g>
          {win}
          <rect x="70" y="104" width="150" height="14" rx="7" fill={W} opacity="0.7" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="70" y={134 + i * 18} width={i === 3 ? 150 : 262} height="7" rx="3.5" fill={W} opacity="0.28" />
          ))}
          <path d="M70 236 Q120 214 170 236 T270 236 T330 236" fill="none" stroke={W} strokeOpacity="0.55" strokeWidth="3" />
        </g>
      );
    default:
      return win;
  }
}

export default function ProjectThumb({ id, gradient, art, image, alt, className }: Props) {
  if (image) {
    // Real photography / screenshots take over when provided.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt ?? ""} className={className} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />;
  }
  const gid = `grad-${id}`;
  return (
    <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={gradient[0]} />
          <stop offset="1" stopColor={gradient[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill={`url(#${gid})`} />
      <circle cx="330" cy="60" r="120" fill={W} opacity="0.06" />
      <Mockup art={art} />
    </svg>
  );
}
