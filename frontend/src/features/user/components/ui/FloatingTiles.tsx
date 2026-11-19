type Tile = { pos: string; size: number; rotate: number; tint?: boolean; duration: number };

/** Decorative frosted squares that drift in purple headers. */
const FloatingTiles: React.FC<{ tiles: Tile[] }> = ({ tiles }) => (
  <>
    {tiles.map((t, i) => (
      <div key={i} className={`absolute pointer-events-none ${t.pos}`} aria-hidden="true">
        <div className="animate-ml-float" style={{ animationDuration: `${t.duration}s` }}>
          <div
            style={{
              width: t.size,
              height: t.size,
              borderRadius: Math.round(t.size * 0.28),
              transform: `rotate(${t.rotate}deg)`,
              background: t.tint ? "rgba(207,227,255,.22)" : "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.28)",
            }}
          />
        </div>
      </div>
    ))}
  </>
);

export default FloatingTiles;
