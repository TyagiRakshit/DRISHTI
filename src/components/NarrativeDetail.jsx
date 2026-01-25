
import React, { useMemo } from 'react';
import { ArrowLeft, Calendar, FileText, Hash, Globe, Users, ExternalLink, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import narrativeData from '../data/narrative_data.json';

const NarrativeDetail = ({ narrativeId, onBack }) => {
    const data = useMemo(() => {
        // Flatten the hierarchy to find the specific frame by ID
        let foundFrame = null;
        for (const narrative of narrativeData) {
            const frame = narrative.frames.find(f => f.frame_id.toString() === narrativeId.toString());
            if (frame) {
                foundFrame = frame;
                break;
            }
        }

        if (!foundFrame) return null;

        const raw = foundFrame;

        // Same title logic as elsewhere (should probably be a utility)
        const topEvidence = raw.evidence && raw.evidence.length > 0 ? raw.evidence[0].sentence : "Unknown Narrative";
        const wordCount = 12;
        const words = topEvidence.split(/\s+/);
        const generatedTitle = words.length > wordCount
            ? words.slice(0, wordCount).join(' ').replace(/[^\w\s]$/, '') + '...'
            : topEvidence;

        return {
            id: raw.frame_id,
            title: generatedTitle,
            fullEvidence: topEvidence,
            stats: raw.stats,
            evidence: raw.evidence,
            timeseries: raw.timeseries.map(t => ({
                date: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                vol: t.count,
                rawDate: t.date
            }))
        };
    }, [narrativeId]);

    if (!data) return <div className="p-10 text-white">Narrative not found</div>;

    return (
        <div className="absolute inset-0 z-30 bg-[#0c0a09] flex flex-col pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="h-20 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center px-8 gap-6">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 hover:bg-white/5 rounded-full text-stone-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                            FRAME #{data.id}
                        </span>
                        <span className="text-xs font-mono text-stone-500">
                            DETECTED: {new Date(data.stats.first_seen).toLocaleDateString()}
                        </span>
                    </div>
                    <h1 className="text-2xl font-display font-bold text-stone-100 leading-none">{data.title}</h1>
                </div>
            </div>

            {/* Main Content Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto p-8 space-y-8">

                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 border border-white/5 p-5 rounded-lg">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                                <FileText size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Total Volume</span>
                            </div>
                            <div className="text-3xl font-display font-bold text-white">{data.stats.total_sentences}</div>
                            <div className="text-xs text-stone-500 mt-1">Discourse Units</div>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-5 rounded-lg">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                                <Users size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Unique Sources</span>
                            </div>
                            <div className="text-3xl font-display font-bold text-orange-400">{data.stats.unique_posts}</div>
                            <div className="text-xs text-stone-500 mt-1">Individual Posters</div>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-5 rounded-lg">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                                <Activity size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Activity Windows</span>
                            </div>
                            <div className="text-3xl font-display font-bold text-emerald-400">{data.stats.windows_present}</div>
                            <div className="text-xs text-stone-500 mt-1">72h Rolling Windows</div>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-5 rounded-lg">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                                <Calendar size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Duration</span>
                            </div>
                            <div className="text-3xl font-display font-bold text-white">{data.stats.duration_days}</div>
                            <div className="text-xs text-stone-500 mt-1">Active Days</div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-black/20 border border-white/5 rounded-lg p-6">
                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
                            Propagation Timeline
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.timeseries}>
                                    <defs>
                                        <linearGradient id="colorVolDetail" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#78716c', fontSize: 12 }}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#78716c', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #333' }}
                                        itemStyle={{ color: '#f97316' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="vol"
                                        stroke="#f97316"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorVolDetail)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Evidence List */}
                    <div className="bg-black/20 border border-white/5 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-stone-900/50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                                Evidence Artifacts
                            </h3>
                            <span className="text-xs font-mono text-stone-600">{data.evidence.length} ITEMS</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {data.evidence.map((ev, i) => (
                                <div key={i} className="p-4 hover:bg-white/5 transition-colors group">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 pt-1 flex flex-col items-center">
                                            <div className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center text-xs font-mono text-stone-500">
                                                {i + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-stone-300 text-sm leading-relaxed mb-2 font-medium">
                                                "{ev.sentence}"
                                            </p>
                                            <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
                                                <span className={`px-1.5 py-0.5 rounded border ${ev.source === 'post' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-stone-500/10 border-stone-500/20 text-stone-400'} uppercase`}>
                                                    {ev.source}
                                                </span>
                                                <span>{new Date(ev.timestamp).toLocaleString()}</span>
                                                <a
                                                    href={`https://redd.it/${ev.post_id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1 hover:text-orange-400 transition-colors"
                                                >
                                                    {ev.post_id} <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NarrativeDetail;
