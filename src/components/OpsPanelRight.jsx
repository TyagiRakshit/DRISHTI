import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Share2, CheckCircle, AlertTriangle, Search, ExternalLink } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import narrativeData from '../data/narrative_data.json';

const OpsPanelRight = ({ selectedId }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!selectedId && narrativeData.length > 0) {
            // Default to first if none selected
            processData(narrativeData[0]);
        } else if (selectedId) {
            const found = narrativeData.find(n => n.narrative_id.toString() === selectedId.toString());
            if (found) {
                processData(found);
            }
        }
    }, [selectedId]);

    const processData = (theme) => {
        // Synthesize data from Theme (Meta-Narrative) + Frames

        // 1. Title & Desc
        // Use Theme title directly
        const generatedTitle = theme.title;

        // 2. Timeline Aggregation
        const timelineMap = new Map();
        theme.frames.forEach(frame => {
            frame.timeseries.forEach(day => {
                const val = timelineMap.get(day.date) || 0;
                timelineMap.set(day.date, val + day.count);
            });
        });
        const aggregatedTimeline = Array.from(timelineMap.entries())
            .map(([date, count]) => ({
                time: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                vol: count,
                fullDate: date
            }))
            .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

        // 3. Evidence Aggregation (Take top 1 from top 10 frames)
        let aggEvidence = [];
        theme.frames.slice(0, 10).forEach(f => {
            if (f.evidence && f.evidence.length > 0) {
                aggEvidence.push({
                    ...f.evidence[0],
                    frameId: f.frame_id,
                    sourceFrameTitle: f.title
                });
            }
        });

        // 4. Stats Aggregation
        let uniquePosts = 0;
        let windowsPresent = 0;
        let firstSeen = null;
        let lastSeen = null;

        theme.frames.forEach(f => {
            uniquePosts += f.stats.unique_posts;
            windowsPresent = Math.max(windowsPresent, f.stats.windows_present); // Max Window overlap

            const fStart = new Date(f.stats.first_seen);
            const fEnd = new Date(f.stats.last_seen);

            if (!firstSeen || fStart < firstSeen) firstSeen = fStart;
            if (!lastSeen || fEnd > lastSeen) lastSeen = fEnd;
        });

        const durationDays = firstSeen && lastSeen ? Math.floor((lastSeen - firstSeen) / (1000 * 60 * 60 * 24)) : 0;

        setData({
            id: theme.narrative_id,
            title: generatedTitle,
            activeStart: firstSeen ? firstSeen.toLocaleDateString() : 'N/A',
            activeEnd: lastSeen ? lastSeen.toLocaleDateString() : 'N/A',
            duration: `${durationDays} days`,
            totalDiscourseUnits: theme.total_volume,
            uniquePosts: uniquePosts,
            windowsPresent: windowsPresent,
            evidence: aggEvidence.map((ev, i) => ({
                id: i,
                text: ev.sentence,
                source: ev.source === 'post' ? 'OP' : 'Comment',
                type: 'verbatim',
                date: new Date(ev.timestamp).toLocaleDateString(),
                postId: ev.post_id,
                frameId: ev.frameId
            })),
            frames: theme.frames.map(f => ({
                id: f.frame_id,
                title: f.title,
                tier: f.tier || 'Unknown',
                total_sentences: f.stats.total_sentences
            })),
            activityData: aggregatedTimeline
        });
    };

    if (!data) return null;

    return (
        <div className="absolute top-40 right-8 w-96 bottom-12 flex flex-col gap-4 pointer-events-none">
            <div className="tech-panel p-0 pointer-events-auto bg-stone-900/95 h-full flex flex-col overflow-hidden font-mono text-sm border border-orange-500/20 shadow-2xl backdrop-blur-md">

                {/* Header Section */}
                <div className="p-4 border-b border-white/5 bg-gradient-to-r from-orange-950/20 to-transparent">
                    <div className="text-[10px] text-orange-500 mb-1 flex items-center gap-2">
                        <span className="uppercase tracking-widest">Target Analysis</span>
                        <div className="h-px bg-orange-500/20 flex-1"></div>
                        <span className="text-stone-500">NARRATIVE #{data.id}</span>
                    </div>
                    <h2 className="font-display text-lg text-white font-bold leading-tight">{data.title}</h2>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 bg-black/20">
                    {['overview', 'evidence', 'frames'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-xs uppercase tracking-wider font-medium transition-colors ${activeTab === tab
                                ? 'text-orange-400 bg-orange-500/5 border-b-2 border-orange-500'
                                : 'text-stone-500 hover:text-stone-300 hover:bg-white/5'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

                    {/* VIEW: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 p-3 rounded border border-white/5">
                                    <div className="text-[10px] text-stone-500 uppercase mb-1">Duration</div>
                                    <div className="text-xl font-display text-white">{data.duration}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded border border-white/5">
                                    <div className="text-[10px] text-stone-500 uppercase mb-1">Discourse Units</div>
                                    <div className="text-xl font-display text-orange-400">{data.totalDiscourseUnits}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded border border-white/5">
                                    <div className="text-[10px] text-stone-500 uppercase mb-1">Unique Posts</div>
                                    <div className="text-xl font-display text-white">{data.uniquePosts}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded border border-white/5">
                                    <div className="text-[10px] text-stone-500 uppercase mb-1">Active Windows</div>
                                    <div className="text-xl font-display text-emerald-400">{data.windowsPresent}</div>
                                </div>
                            </div>

                            {/* Timeline / Chart Placeholder */}
                            <div className="border border-white/5 rounded p-3 bg-black/20">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs text-stone-400 font-bold">Resonance Activity</span>
                                    <span className="text-[10px] text-stone-600 uppercase">Daily Volume</span>
                                </div>
                                <div className="h-32 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.activityData}>
                                            <defs>
                                                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis
                                                dataKey="time"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#57534e' }}
                                                interval="preserveStartEnd"
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #333', fontSize: '10px' }}
                                                itemStyle={{ color: '#fb923c' }}
                                                cursor={{ stroke: '#ffffff20' }}
                                                labelStyle={{ color: '#a8a29e' }}
                                            />
                                            <Area type="monotone" dataKey="vol" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorVol)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Status Bar */}
                            <div className="flex items-center gap-2 text-xs text-stone-400 bg-orange-500/5 p-2 rounded border border-orange-500/10">
                                <Activity size={14} className="text-orange-500 animate-pulse" />
                                <span>Tracking active propagation vectors...</span>
                            </div>
                        </div>
                    )}

                    {/* VIEW: EVIDENCE */}
                    {activeTab === 'evidence' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                                <span>Representative Artifacts</span>
                                <span>{data.evidence.length} Items</span>
                            </div>
                            {data.evidence.map((item, idx) => (
                                <div key={item.id} className="group relative pl-4 border-l-2 border-white/10 hover:border-orange-500 transition-colors">
                                    <div className="mb-1 text-emerald-400/90 font-medium text-sm leading-snug">
                                        "{item.text}"
                                    </div>
                                    <div className="flex gap-2 text-[10px] text-stone-500 uppercase tracking-wide items-center">
                                        <span className="text-stone-400 font-bold">{item.source}</span>
                                        <span>•</span>
                                        <span>{item.date}</span>
                                        <span>•</span>
                                        <a
                                            href={`https://redd.it/${item.postId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-mono text-orange-500/50 hover:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                            {item.postId}
                                            <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* VIEW: FRAMES */}
                    {activeTab === 'frames' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                                <span>Narrative Frames</span>
                                <span>{data.frames.length} Active</span>
                            </div>
                            {data.frames.map((frame) => (
                                <div key={frame.id} className="bg-white/5 p-3 rounded border border-white/5 hover:border-orange-500/30 transition-colors">
                                    <h4 className="text-sm font-semibold text-stone-200 mb-1">{frame.title}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${frame.tier === 'Dominant' ? 'text-red-400 border-red-900/40 bg-red-950/20' :
                                            frame.tier === 'Emerging' ? 'text-orange-400 border-orange-900/40 bg-orange-950/20' :
                                                'text-stone-500 border-stone-800 bg-stone-900/40'
                                            }`}>
                                            {frame.tier}
                                        </span>
                                        <span className="text-[10px] font-mono text-stone-500 ml-auto">
                                            {frame.total_sentences} units
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}



                </div>
            </div>
        </div>
    );
};

export default OpsPanelRight;
