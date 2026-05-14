'use client';

import { useInView } from '@/hooks/useInView';
import { Link2, Bot, MessageCircle, Video, Shield, BarChart3 } from 'lucide-react';

const features = [
    {
        icon: Link2,
        title: 'Blockchain Secured',
        desc: 'Every medical record is hashed and stored on-chain with tamper-proof verification.',
        accentColor: 'bg-indigo-100',
        hoverBorder: 'group-hover:border-l-indigo-500',
    },
    {
        icon: Bot,
        title: 'AI Medical Analysis',
        desc: 'Advanced AI extracts data from reports and generates risk assessments instantly.',
        accentColor: 'bg-cyan-100',
        hoverBorder: 'group-hover:border-l-cyan-500',
    },
    {
        icon: MessageCircle,
        title: 'AI Health Assistant',
        desc: 'Context-aware chatbot answers questions about your reports and health.',
        accentColor: 'bg-emerald-100',
        hoverBorder: 'group-hover:border-l-emerald-500',
    },
    {
        icon: Video,
        title: 'AI Doctor Avatar',
        desc: 'Tavus-powered video explanations from a virtual doctor for your reports.',
        accentColor: 'bg-orange-100',
        hoverBorder: 'group-hover:border-l-orange-500',
    },
    {
        icon: Shield,
        title: 'Patient-Controlled Access',
        desc: 'Grant and revoke doctor access to your records through smart contracts.',
        accentColor: 'bg-rose-100',
        hoverBorder: 'group-hover:border-l-rose-500',
    },
    {
        icon: BarChart3,
        title: 'Risk Intelligence',
        desc: 'Visual risk scores, condition detection, and specialist recommendations.',
        accentColor: 'bg-violet-100',
        hoverBorder: 'group-hover:border-l-violet-500',
    },
];

export default function FeatureGrid() {
    const { ref, isInView } = useInView({ threshold: 0.1 });

    return (
        <section id="features" ref={ref} className="py-28 px-6 bg-[#fdfbf7] relative">
            {/* Section divider */}
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="max-w-6xl mx-auto">
                <div className={`text-center mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-gray-500 font-mono mb-4 border-2 border-black/10 px-4 py-2">
                        Platform Features
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif">
                        <span className="gradient-text">Intelligent Healthcare</span> Platform
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto font-medium">End-to-end medical intelligence combining AI, blockchain, and decentralized access control.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={i}
                                className={`group retro-card p-8 bg-white hover:bg-yellow-50/50 transition-all duration-500 border-l-4 border-l-transparent ${f.hoverBorder} ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                                style={{ animationDelay: `${i * 120}ms` }}
                            >
                                <div className={`w-14 h-14 border-2 border-black ${f.accentColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-6 group-hover:-translate-y-1 group-hover:rotate-3 transition-all duration-300`}>
                                    <Icon className="w-6 h-6 text-black" strokeWidth={2} />
                                </div>
                                <h3 className="text-lg font-bold text-black uppercase mb-3 font-mono tracking-tight">{f.title}</h3>
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
