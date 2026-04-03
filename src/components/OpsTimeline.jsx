import React from 'react';

const OpsTimeline = () => {
    return (
        <div className="absolute bottom-4 left-4 right-4 h-24 pointer-events-none">
            <div className="tech-panel w-full h-full pointer-events-auto bg-stone-900/95 flex items-center px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-orange-500"></div>

                {/* Timeline Tracks */}
                <div className="flex-1 flex flex-col gap-2 relative">
                    {/* Time Markers */}
                    <div className="flex justify-between text-[10px] text-stone-500 font-mono absolute -top-3 w-full px-2">
                        <span>48h Ago</span>
                        <span>24h Ago</span>
                        <span>12h Ago</span>
                        <span>6h Ago</span>
                        <span>NOW</span>
                    </div>

                    <div className="w-full h-4 bg-white/5 relative mt-2 border border-white/5">
                        <div className="absolute top-0 left-[15%] w-[10%] h-full bg-stone-500/20 border-l border-r border-stone-500/40 flex items-center justify-center text-[9px] text-stone-300">
                            ORIGIN
                        </div>
                        <div className="absolute top-0 left-[40%] w-[20%] h-full bg-orange-500/20 border-l border-r border-orange-500/40 flex items-center justify-center text-[9px] text-orange-300">
                            AMPLIFICATION
                        </div>
                    </div>
                    <div className="w-full h-4 bg-white/5 relative border border-white/5">
                        <div className="absolute top-0 left-[70%] w-[5%] h-full bg-red-500/20 border-l border-r border-red-500/40 flex items-center justify-center text-[9px] text-red-300">
                            LEAK
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-48 border-l border-white/10 pl-4 ml-4 flex flex-col justify-center gap-2">
                    <div className="flex justify-between items-center text-xs text-stone-400">
                        <span>Analysis Window</span>
                        <span className="text-orange-400">REALTIME</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="h-1 w-full bg-orange-500 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpsTimeline;
