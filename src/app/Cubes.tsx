export function Cubes({ heights }: { heights: number[] }) {
  return (
    <svg
      className="cube-scene"
      viewBox="0 0 320 250"
      role="img"
      aria-label={`Four solid columns with heights ${heights.join(", ")}`}
    >
      {heights.flatMap((height, index) =>
        Array.from({ length: height }, (_, z) => {
          const x = index % 2,
            y = Math.floor(index / 2);
          const sx = 160 + (x - y) * 39,
            sy = 160 + (x + y) * 22 - z * 35;
          return (
            <g key={`${index}-${z}`} stroke="#8de6f3" strokeWidth="1">
              <polygon
                points={`${sx},${sy - 35} ${sx + 38},${sy - 13} ${sx},${sy + 9} ${sx - 38},${sy - 13}`}
                fill="#2d798e"
              />
              <polygon
                points={`${sx - 38},${sy - 13} ${sx},${sy + 9} ${sx},${sy + 44} ${sx - 38},${sy + 22}`}
                fill="#19384b"
              />
              <polygon
                points={`${sx},${sy + 9} ${sx + 38},${sy - 13} ${sx + 38},${sy + 22} ${sx},${sy + 44}`}
                fill="#24586c"
              />
            </g>
          );
        }),
      )}
    </svg>
  );
}
