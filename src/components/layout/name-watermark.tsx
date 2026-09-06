import { nameOutline } from "@/components/layout/name-outline";

const heights = { lg: 168, sm: 104 } as const;

/**
 * Giant outlined name behind the header and hero. Inline SVG of glyph paths
 * (see scripts/generate-name-outline.mjs): no script, no request, no font
 * dependency, no animation. Paths rather than <text> so the browser never
 * treats the decoration as the largest contentful paint. The wrapper is
 * absolutely positioned against the document, sits under everything
 * including the sticky header, and clips the drawing at the viewport edge,
 * so narrow screens see fewer letters instead of smaller ones.
 */
export function NameWatermark({ size }: { size: keyof typeof heights }) {
  const height = heights[size];
  const width = Math.round((height * nameOutline.width) / nameOutline.height);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden select-none"
      style={{ height }}
    >
      <svg
        className="watermark text-brand"
        width={width}
        height={height}
        viewBox={`0 0 ${nameOutline.width} ${nameOutline.height}`}
        style={{ marginLeft: -height * 0.03 }}
      >
        <path
          d={nameOutline.path}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
