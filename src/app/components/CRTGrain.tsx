export function CRTGrain() {
  return (
    <>
      {/* CRT scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)",
        }}
      />
      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[99]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </>
  );
}
