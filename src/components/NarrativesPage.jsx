import React, { useMemo, useState } from 'react';
import { ArrowLeft, Clock, Hash, Globe, TrendingUp, AlertCircle, ExternalLink, Search } from 'lucide-react';
import narrativeData from '../data/narrative_data.json';

const NarrativesPage = ({ onBack, onSelect }) => {
    const [filter, setFilter] = useState('all'); // all, viral, high, rising
    const [searchQuery, setSearchQuery] = useState('');

    const allNarratives = useMemo(() => {
        return narrativeData.map(n => {
            // Title Generation Logic
            const topEvidence = n.evidence && n.evidence.length > 0 ? n.evidence[0].sentence : "No evidence available";
            const wordCount = 12;
            const words = topEvidence.split(/\s+/);
            const generatedTitle = words.length > wordCount
                ? words.slice(0, wordCount).join(' ').replace(/[^\w\s]$/, '') + '...'
                : topEvidence;

            // Velocity Logic
            const recentActivity = n.timeseries && n.timeseries.length > 0 ? n.timeseries[n.timeseries.length - 1].count : 0;
            let velocity = 'stable';
            if (recentActivity > 10) velocity = 'viral';
            else if (recentActivity > 5) velocity = 'high';
            else if (recentActivity > 2) velocity = 'rising';

            return {
                id: n.narrative_id.toString(),
                title: generatedTitle,
                fullEvidence: topEvidence,
                velocity,
                stats: n.stats,
                lastSeen: new Date(n.stats.last_seen).toLocaleDateString()
            };
        }).sort((a, b) => b.stats.total_sentences - a.stats.total_sentences);
    }, []);

    const filtered = allNarratives.filter(n => {
        const matchesFilter = filter === 'all' || n.velocity === filter;
        const loweredQuery = searchQuery.toLowerCase();
        const matchesSearch = n.title.toLowerCase().includes(loweredQuery) ||
            n.fullEvidence.toLowerCase().includes(loweredQuery) ||
            n.id.includes(loweredQuery);
        return matchesFilter && matchesSearch;
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
                    <h1 className="text-xl font-display font-bold tracking-wider text-white">INTELLIGENCE ARCHIVE</h1>
                    <div className="text-xs text-orange-500/60 font-mono flex gap-4">
                        <span>TOTAL CLUSTERS: {allNarratives.length}</span>
                        <span>ACTIVE MONITORING</span>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-hidden flex">
                {/* Filters Sidebar */}
                <div className="w-64 border-r border-white/5 bg-black/20 p-4 space-y-2">

                    {/* Search Bar */}
                    <div className="px-1 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={12} />
                            <input
                                type="text"
                                placeholder="SEARCH ARCHIVE..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded py-2 pl-8 pr-3 text-xs text-stone-300 focus:outline-none focus:border-orange-500/30 focus:bg-white/5 placeholder:text-stone-600 font-mono transition-all"
                            />
                        </div>
                    </div>

                    <div className="text-xs font-bold text-stone-500 mb-4 px-2 tracking-widest">FILTERS</div>
                    {['all', 'viral', 'high'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`w-full text-left px-3 py-2 rounded text-xs uppercase font-medium transition-colors ${filter === f
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'text-stone-400 hover:bg-white/5'}`}
                        >
                            {f} NARRATIVES
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-stone-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(item => (
                            <div
                                key={item.id}
                                onClick={() => onSelect(item.id)}
                                className="group bg-black/40 border border-white/5 hover:border-orange-500/40 p-4 rounded-lg cursor-pointer transition-all hover:bg-white/5 flex flex-col gap-3"
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${item.velocity === 'viral' ? 'bg-red-900/40 text-red-400' :
                                        item.velocity === 'high' ? 'bg-orange-900/40 text-orange-400' :
                                            'bg-emerald-900/40 text-emerald-400'
                                        }`}>
                                        {item.velocity}
                                    </span>
                                    <span className="text-[10px] font-mono text-stone-600">ID: {item.id}</span>
                                </div>

                                <h3 className="text-sm font-semibold text-stone-200 group-hover:text-orange-200 leading-snug line-clamp-2">
                                    {item.title}
                                </h3>

                                <p className="text-xs text-stone-500 line-clamp-3 italic mb-auto">
                                    "{item.fullEvidence}"
                                </p>

                                <div className="pt-3 mt-1 border-t border-white/5 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                                    <div className="flex items-center gap-1">
                                        <Hash size={10} />
                                        <span>{item.stats.total_sentences} UNITS</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={10} />
                                        <span>{item.lastSeen}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NarrativesPage;
