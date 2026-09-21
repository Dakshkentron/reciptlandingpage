/**
 * The Kentron AI logomark — a receipt with a torn bottom edge, agent inside.
 * Strokes use `currentColor` so the mark inherits whatever text color it sits in;
 * the inner highlight uses `paperClassName` so it can match a dark or light ground.
 */
export default function ReceiptMark({
  className = 'h-7 w-7',
  paperClassName = 'text-white',
}: {
  className?: string;
  paperClassName?: string;
}) {
  return (
    <svg viewBox="0 0 512 512" fill="none" className={className} role="img" aria-label="Kentron AI">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path
          d="M150 82H396V398L372 382L348 398L324 382L300 398L276 382L252 398L228 382L204 398L180 382L156 398V82Z"
          strokeWidth="28"
        />
        <path d="M226 116C226 148 248 166 274 166C300 166 322 148 322 116" strokeWidth="24" />
        <path
          d="M248 170L230 146M300 170L318 146M224 246H196M224 284H196M324 246H352M324 284H352"
          strokeWidth="18"
        />
      </g>
      <path
        d="M224 214C224 184 248 160 274 160C300 160 324 184 324 214V294C324 332 300 360 274 360C248 360 224 332 224 294V214Z"
        fill="currentColor"
      />
      <g
        className={paperClassName}
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M274 166V354" />
        <path d="M232 230C244 218 258 212 274 212C290 212 304 218 316 230M232 292C244 306 258 314 274 314C290 314 304 306 316 292" />
      </g>
    </svg>
  );
}
