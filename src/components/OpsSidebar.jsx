import React, { useState, useMemo } from 'react';
import { Clock, Globe, Hash, TrendingUp, AlertCircle } from 'lucide-react';
import narrativeData from '../data/narrative_data.json';

const OpsSidebar = ({ activeId, onSelect, onViewAll }) => {
    const narratives = useMemo(() => {
        // Process the narrative data into the format needed for the sidebar
        const processed = narrativeData.map(n => {
            // Narrative Data Structure is now Hierarchical (Themes -> Frames)

            // Use the actual tier from data
            const tier = n.tier || 'Unknown';

            // Find latest timestamp among frames
            let latestDate = new Date(0);
            n.frames.forEach(f => {
                const date = new Date(f.stats.last_seen);
                if (date > latestDate) latestDate = date;
            });
            const timeString = latestDate.getFullYear() === 1970 ? "Unknown" : latestDate.toLocaleDateString();

            return {
                id: n.narrative_id.toString(),
                title: n.title,
                source: n.frame_count > 3 ? 'Multi-Angle' : 'Focused',
                velocity: tier, // Using 'velocity' prop name to minimize UI changes below, but content is Tier
                time: timeString,
                desc: n.description,
                stats: {
                    total_sentences: n.total_volume
                }
            };
        });

        // Sort by total volume
        processed.sort((a, b) => b.stats.total_sentences - a.stats.total_sentences);

        return processed;
    }, []);

    return (
        <div className="absolute top-40 left-8 w-96 bottom-12 flex flex-col gap-4 pointer-events-none">
            {/* Fake Window Header Panel */}
            <div className="tech-panel p-0 pointer-events-auto overflow-hidden flex flex-col h-full bg-stone-900/90">
                <div className="flex items-center gap-4 p-3 border-b border-orange-500/20 bg-orange-950/30">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <div className="w-3 h-3 rounded-full bg-orange-700"></div>
                        <div className="w-3 h-3 rounded-full bg-orange-900"></div>
                    </div>
                    <span className="font-display font-bold tracking-widest text-orange-400 uppercase text-sm">Narratives</span>
                    <span className="ml-auto text-xs text-orange-500/50 font-mono">{narratives.length} ACTIVE</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {narratives.slice(0, 8).map(lead => (
                        <div
                            key={lead.id}
                            onClick={() => onSelect(lead.id)}
                            className={`p-3 border transition-all cursor-pointer group ${activeId === lead.id
                                ? 'bg-orange-500/10 border-orange-500'
                                : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-white/5'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                                    <Globe size={10} />
                                    <span>{lead.source}</span>
                                </div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1 ${lead.velocity === 'Dominant' ? 'bg-red-500/20 text-red-500' :
                                    lead.velocity === 'Emerging' ? 'bg-orange-500/20 text-orange-500' :
                                        'bg-stone-500/20 text-stone-400'
                                    }`}>
                                    {lead.velocity === 'Dominant' && <TrendingUp size={10} />}
                                    {lead.velocity}
                                </span>
                            </div>
                            <h4 className={`text-sm font-semibold mb-1 font-display ${activeId === lead.id ? 'text-orange-100' : 'text-stone-300 group-hover:text-orange-200'}`}>
                                {lead.title}
                            </h4>
                            <p className="text-xs text-stone-500 leading-relaxed mb-2 line-clamp-3 italic">
                                "{lead.desc}"
                            </p>
                            <div className="flex items-center gap-3 text-[10px] text-stone-500 border-t border-white/5 pt-2 mt-2">
                                <span className="font-mono text-orange-500/50">ID: {lead.id}</span>
                                <span className="flex items-center gap-1"><Hash size={10} /> {lead.stats.total_sentences} units</span>
                                <span className="ml-auto flex items-center gap-1"><Clock size={10} /> {lead.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-3 border-t border-orange-500/20 bg-black/40">
                    <button
                        onClick={onViewAll}
                        className="w-full py-2 bg-orange-600/20 border border-orange-500/50 text-orange-400 text-xs uppercase hover:bg-orange-600/30 transition-colors tracking-wider font-display font-medium"
                    >
                        Explore Meta-Narratives ({narratives.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OpsSidebar;
