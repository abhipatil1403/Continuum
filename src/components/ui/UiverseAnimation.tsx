// UiverseAnimation — SVG-based animated title with cursor interaction

export default function UiverseAnimation() {
  return (
    <div className="w-full max-w-[550px] relative">
      <style>{`
        #cursor, #box, #text-group {
          cursor: pointer;
        }
        #cursor {
          overflow: visible;
          transform: translate3d(300px, 0, 0) scale(1);
          transform-origin: center center;
          transform-box: fill-box;
          animation: cursorAnim 2.5s ease forwards;
        }
        @keyframes cursorAnim {
          0% { opacity: 0; transform: translate3d(300px, 0, 0) scale(1); }
          20% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
          60% { opacity: 1; transform: translate3d(-180px, -180px, 0) scale(1); }
          65% { opacity: 1; transform: translate3d(-180px, -180px, 0) scale(0.95); }
          70% { opacity: 1; transform: translate3d(-180px, -180px, 0) scale(1); }
          100% { opacity: 0; transform: translate3d(-280px, -30px, 0) scale(1); }
        }
        #box {
          opacity: 0;
          animation: boxAnim 2.5s ease forwards;
        }
        @keyframes boxAnim {
          0%, 60% { opacity: 0; }
          65%, 100% { opacity: 1; }
        }
      `}</style>
      
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 550 160" className="w-full h-auto overflow-visible">
        <g id="Frame">
          {/* Text Group */}
          <g id="text-group">
            <text 
              x="10" 
              y="100" 
              textAnchor="start" 
              fill="currentColor" 
              className="text-7xl font-extrabold tracking-tight font-sans"
            >
              Continuum
            </text>
          </g>

          {/* Figma Box */}
          <g id="box">
            {/* Main outline - matching text bounds roughly */}
            <path strokeWidth="2" stroke="#0D99FF" fillOpacity="0.05" fill="#0D99FF" d="M430 20 H10 V115 H430 V20 Z" />
            
            {/* Corners */}
            <path strokeWidth="2" stroke="#0D99FF" fill="white" d="M15 15 H5 V25 H15 V15 Z" />
            <path strokeWidth="2" stroke="#0D99FF" fill="white" d="M15 110 H5 V120 H15 V110 Z" />
            <path strokeWidth="2" stroke="#0D99FF" fill="white" d="M435 110 H425 V120 H435 V110 Z" />
            <path strokeWidth="2" stroke="#0D99FF" fill="white" d="M435 15 H425 V25 H435 V15 Z" />
          </g>

          {/* Cursor Group */}
          <g id="cursor">
            {/* Cursor arrow pointing at (410, 250) base position */}
            <path strokeWidth="2" stroke="white" fill="#0D99FF" d="M410 250 L433 264 L421.75 266.5 L415.38 276 Z" />
            {/* Label Background */}
            <rect fill="#0D99FF" x="432" y="270" width="90" height="26" rx="2" />
            {/* Label Text */}
            <text x="440" y="287" fill="white" fontSize="13" fontWeight="500" fontFamily="Inter, sans-serif">
              Continuum
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
