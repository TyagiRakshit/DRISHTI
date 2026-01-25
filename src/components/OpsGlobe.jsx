import React, { useEffect, useState } from 'react';

const OpsGlobe = () => {
    return (
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center z-0 bg-grid-pattern">
            {/* Central Planet */}
            <div className="relative w-[75vh] h-[75vh] rounded-full border border-orange-500/20 bg-[#050302] shadow-[0_0_100px_rgba(249,115,22,0.15)] ">

                {/* Abstract Map Data (Dots) */}
                <div className="absolute inset-0 rounded-full opacity-40 animate-[spin_60s_linear_infinite]">
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-orange-400 rounded-full"
                            style={{
                                top: `${Math.random() * 80 + 10}%`,
                                left: `${Math.random() * 80 + 10}%`,
                                opacity: Math.random()
                            }}
                        />
                    ))}
                </div>

                {/* Orbit Rings */}
                <div className="absolute -inset-10 rounded-full border border-dashed border-orange-500/10 animate-[spin_80s_linear_infinite_reverse]"></div>
                <div className="absolute -inset-24 rounded-full border border-orange-500/5"></div>

                {/* Connecting Arcs (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                    <path d="M 120,200 Q 250,100 400,150" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse" />
                    <path d="M 400,150 Q 550,250 600,300" fill="none" stroke="#f97316" strokeWidth="1" className="opacity-50" />

                    {/* Dynamic Markers */}
                    <circle cx="120" cy="200" r="3" fill="#ef4444" className="animate-ping" />
                    <circle cx="400" cy="150" r="4" fill="#f97316" />
                    <circle cx="600" cy="300" r="3" fill="#22c55e" />
                </svg>

            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient-vignette pointer-events-none"></div>
            <style>{`
        .bg-radial-gradient-vignette {
          background: radial-gradient(circle, transparent 50%, #050302 95%);
        }
      `}</style>
        </div>
    );
};

export default OpsGlobe;
