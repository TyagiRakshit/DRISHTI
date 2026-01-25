
import React, { useMemo, useState } from 'react';
import { ArrowLeft, Clock, Hash, Globe, TrendingUp, AlertCircle, ExternalLink, ChevronRight, Layers, Search } from 'lucide-react';
import narrativeData from '../data/narrative_data.json';

const ThemeSelectionPage = ({ onSelectTheme, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [tierFilter, setTierFilter] = useState('ALL'); // ALL, Dominant, Emerging, Weak

    // Flattened sorting by total volume
    const sortedThemes = useMemo(() => {
        return [...narrativeData].sort((a, b) => b.total_volume - a.total_volume);
    }, []);

    const filteredThemes = sortedThemes.filter(theme => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = theme.title.toLowerCase().includes(query) ||
            theme.description.toLowerCase().includes(query) ||
            theme.narrative_id.toString().includes(query);

        const matchesTier = tierFilter === 'ALL' || (theme.tier && theme.tier.toUpperCase() === tierFilter.toUpperCase());

        return matchesSearch && matchesTier;
    });

    return (
        <div className="absolute inset-0 z-20 bg-[#050302] flex flex-col animate-in fade-in duration-300 pointer-events-auto">
            {/* Header */}
            <div className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center px-6 gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/5 rounded-full text-stone-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-display font-bold tracking-wider text-white">NARRATIVES</h1>
                    <div className="text-xs text-orange-500/60 font-mono flex gap-4">
                        <span>IDENTIFIED NARRATIVES: {sortedThemes.length}</span>
                        <span>GLOBAL MONITORING</span>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto p-8 bg-stone-900/50">
                {/* Search Bar */}
                <div className="mb-8 max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH NARRATIVES..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-full py-3 pl-10 pr-4 text-sm text-stone-300 focus:outline-none focus:border-orange-500/50 focus:bg-white/5 placeholder:text-stone-600 font-mono transition-all shadow-lg"
                    />
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-2 mb-8">
                    {['ALL', 'DOMINANT', 'EMERGING', 'WEAK'].map(tier => (
                        <button
                            key={tier}
                            onClick={() => setTierFilter(tier)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all ${tierFilter === tier
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                                    : 'bg-black/40 text-stone-500 border-white/10 hover:border-white/20 hover:text-stone-300'
                                }`}
                        >
                            {tier}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredThemes.map(theme => (
                        <div
                            key={theme.narrative_id}
                            onClick={() => onSelectTheme(theme)}
                            className="group bg-black/40 border border-white/5 hover:border-orange-500/40 p-5 rounded-xl cursor-pointer transition-all hover:bg-white/5 flex flex-col gap-4 relative overflow-hidden"
                        >
                            {/* Decorative ID Background */}
                            <span className="absolute -right-4 -top-4 text-[100px] font-display font-bold text-white/5 group-hover:text-orange-500/5 transition-colors select-none">
                                {theme.narrative_id}
                            </span>

                            <div className="flex justify-between items-start relative z-10 w-full">
                                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold flex items-center gap-1 border border-white/5
                                    ${theme.tier === 'Dominant' ? 'bg-red-900/40 text-red-500 border-red-500/20' :
                                        theme.tier === 'Emerging' ? 'bg-orange-900/40 text-orange-400 border-orange-500/20' :
                                            'bg-stone-800/60 text-stone-400 border-stone-600/20'
                                    }`}>
                                    {theme.tier === 'Dominant' && <AlertCircle size={10} />}
                                    {theme.tier === 'Emerging' && <TrendingUp size={10} />}
                                    {theme.tier || 'UNKNOWN'}
                                </span>
                                {theme.frame_count > 5 && (
                                    <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold bg-white/5 text-stone-400 border border-white/5">
                                        <Layers size={10} />
                                    </span>
                                )}
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-stone-200 group-hover:text-orange-100 leading-snug mb-2 line-clamp-2">
                                    {theme.title}
                                </h3>
                                <p className="text-sm text-stone-500 italic line-clamp-3">
                                    "{theme.description}"
                                </p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-stone-500 font-mono relative z-10">
                                <div className="flex items-center gap-2">
                                    <Hash size={12} />
                                    <span>{theme.total_volume} UNITS</span>
                                </div>
                                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-orange-500/60">
                                    <span>{theme.frame_count} FRAMES</span>
                                    <ChevronRight size={12} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeSelectionPage;
