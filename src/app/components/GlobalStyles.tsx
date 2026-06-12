export function GlobalStyles() {
  return (
    <style>{`
      @keyframes legendary-rotate {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes shimmer {
        0%   { transform: translateX(-100%) rotate(15deg); }
        100% { transform: translateX(400%) rotate(15deg); }
      }
      @keyframes grain {
        0%, 100% { transform: translate(0,0); }
        20%  { transform: translate(-2%,-3%); }
        40%  { transform: translate(-4%, 2%); }
        60%  { transform: translate( 3%,-3%); }
        80%  { transform: translate(-3%, 4%); }
      }
      @keyframes legendary-pulse {
        0%, 100% { box-shadow: 0 0 30px rgba(255,209,102,0.4), 0 0 60px rgba(230,57,70,0.15); }
        50%       { box-shadow: 0 0 55px rgba(255,209,102,0.75), 0 0 100px rgba(230,57,70,0.3); }
      }
      @keyframes epic-pulse {
        0%, 100% { box-shadow: 0 0 20px rgba(123,44,191,0.35), 0 0 40px rgba(123,44,191,0.12); }
        50%       { box-shadow: 0 0 40px rgba(123,44,191,0.65), 0 0 70px rgba(123,44,191,0.28); }
      }
      @keyframes neo-pulse {
        0%, 100% { box-shadow: 0 0 20px rgba(0,217,255,0.35), 0 0 40px rgba(0,217,255,0.12); }
        50%       { box-shadow: 0 0 40px rgba(0,217,255,0.65), 0 0 70px rgba(0,217,255,0.28); }
      }
      @keyframes screen-flash {
        0%   { opacity: 0; }
        20%  { opacity: 0.18; }
        100% { opacity: 0; }
      }
      .card-border-legendary {
        background-image: linear-gradient(90deg, #FFD166, #E63946, #7B2CBF, #3A86FF, #0E5A47, #FFD166);
        background-size: 300% 300%;
        animation: legendary-rotate 4s ease infinite;
      }
      .card-border-epic {
        background-image: linear-gradient(90deg, #7B2CBF, #C084FC, #7B2CBF);
        background-size: 300% 300%;
        animation: legendary-rotate 4s ease infinite, epic-pulse 3s ease-in-out infinite;
      }
      .card-border-rare {
        background-image: linear-gradient(90deg, #118AB2, #38BDF8, #118AB2);
        background-size: 300% 300%;
        animation: legendary-rotate 4s ease infinite, rare-pulse 3s ease-in-out infinite;
      }
      @keyframes fogDrift1 {
        0%   { transform: translateX(-3%) translateY(0px); opacity: 0.6; }
        50%  { transform: translateX(3%) translateY(-20px); opacity: 1; }
        100% { transform: translateX(-1%) translateY(10px); opacity: 0.7; }
      }
      @keyframes fogDrift2 {
        0%   { transform: translateX(4%) translateY(10px); opacity: 0.5; }
        50%  { transform: translateX(-4%) translateY(0px); opacity: 0.9; }
        100% { transform: translateX(2%) translateY(-15px); opacity: 0.6; }
      }
      /* Hide scrollbar until hovering */
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.06) transparent;
      }
      *::-webkit-scrollbar { width: 4px; }
      *::-webkit-scrollbar-track { background: transparent; }
      *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 2px; }
    `}</style>
  );
}
