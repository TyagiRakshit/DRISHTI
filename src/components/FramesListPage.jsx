
import React, { useState } from 'react';
import { ArrowLeft, Clock, Hash, ChevronRight, Activity } from 'lucide-react';

const FramesListPage = ({ theme, onSelectFrame, onBack }) => {
    return (
        <div className="absolute inset-0 z-20 bg-[#050302] flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto">
            {/* Header */}
            <div className="h-20 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center px-6 gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/5 rounded-full text-stone-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                        NARRATIVE #{theme.narrative_id}
                        <ChevronRight size={10} />
                        FRAMES
                    </div>
                    <h1 className="text-xl font-display text-white">{theme.title}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-stone-900/50">
                <div className="max-w-5xl mx-auto space-y-4">
                    {theme.frames.map(frame => (
                        <div
                            key={frame.frame_id}
                            onClick={() => onSelectFrame(frame.frame_id)}
                            className="bg-black/40 border border-white/5 hover:border-orange-500/30 p-5 rounded-lg cursor-pointer transition-all hover:bg-white/5 flex items-start gap-4 group"
                        >
                            <div className="mt-1 p-2 rounded bg-white/5 text-stone-400 group-hover:text-orange-400 transition-colors">
                                <Activity size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-stone-200 group-hover:text-white text-lg">
                                        {frame.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${frame.tier === 'Dominant' ? 'text-red-400 border-red-900/40 bg-red-950/20' :
                                            frame.tier === 'Emerging' ? 'text-orange-400 border-orange-900/40 bg-orange-950/20' :
                                                'text-stone-500 border-stone-800 bg-stone-900/40'
                                            }`}>
                                            {frame.tier}
                                        </span>
                                        <span className="text-xs font-mono text-stone-600 bg-black/30 px-2 py-1 rounded">
                                            ID: {frame.frame_id}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-stone-500 italic mb-3 border-l-2 border-white/5 pl-3">
                                    "{frame.description}"
                                </p>
                                <div className="flex items-center gap-6 text-xs text-stone-500 font-mono">
                                    <div className="flex items-center gap-1">
                                        <Hash size={12} />
                                        <span>{frame.stats.total_sentences} SENTENCES</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{new Date(frame.stats.last_seen).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="self-center text-stone-700 group-hover:text-orange-500 transition-colors">
                                <ChevronRight size={24} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FramesListPage;
