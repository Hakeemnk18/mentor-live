export default function TopLoader({ loading }: { loading: boolean }) {
  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#6D35D9] to-[#FF6B5E]"
        style={{
          animation: "loadingBar 1.2s ease-in-out infinite",
        }}
      />
      <style>
        {`
          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(-30%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
}
