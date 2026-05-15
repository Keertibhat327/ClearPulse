'use client';

import Image from 'next/image';
import { useInView } from '@/hooks/useInView';

const steps = [
    { step: '01', title: 'Choose Your Role', desc: 'Are you a patient or a doctor? Pick your role to get started.', color: 'bg-retro-accent-pink' },
    { step: '02', title: 'Connect Clerk', desc: 'Authenticate with Google — your identity is securely managed by Clerk.', color: 'bg-retro-accent-green' },
    { step: '03', title: 'Upload Report', desc: 'Patients drag and drop medical reports (PDF, images).', color: 'bg-retro-accent-yellow' },
    { step: '04', title: 'AI Analysis', desc: 'AI extracts text, analyzes conditions, generates risk score and specialist recommendations.', color: 'bg-indigo-200' },
    { step: '05', title: 'Explore Results', desc: 'Chat with AI assistant, talk to AI doctor, and manage who can access your records.', color: 'bg-cyan-200' },
];

export default function HowItWorksSection() {
    const { ref, isInView } = useInView({ threshold: 0.1 });

    return (
        <section ref={ref} className="relative py-28 px-6 bg-gradient-to-b from-transparent via-indigo-500/[0.03] to-transparent overflow-hidden">
            {/* Texture Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-multiply">
                <Image
                    src="https://cdn.prod.website-files.com/68c8e57d6e512b9573db146f/68e7b2dcdd75a7584b6cc8fa_sl-bg.png"
                    alt="Texture Background"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className={`text-center mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-gray-500 font-mono mb-4 border-2 border-black/10 px-4 py-2">
                        Getting Started
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold">
                        How <span className="gradient-text">MediChain AI</span> Works
                    </h2>
                </div>

                {/* Timeline */}
                <div className="relative space-y-6">
                    {/* Vertical connecting line */}
                    <div
                        className="absolute left-[29px] top-6 w-[3px] bg-black/10 z-0 transition-all duration-1000"
                        style={{
                            height: isInView ? 'calc(100% - 48px)' : '0px',
                            transitionDelay: '300ms',
                        }}
                    />

                    {steps.map((item, i) => (
                        <div
                            key={i}
                            className={`flex items-start gap-6 retro-card p-6 bg-white/95 backdrop-blur-sm relative z-10 transition-all duration-700 ${isInView ? 'animate-slide-in-left' : 'opacity-0'}`}
                            style={{ animationDelay: `${i * 150 + 200}ms` }}
                        >
                            <div className={`w-14 h-14 border-2 border-black ${item.color} flex items-center justify-center text-black font-black text-lg shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-110 hover:rotate-6 transition-all duration-300 cursor-default`}>
                                {item.step}
                            </div>
                            <div className="pt-1">
                                <h3 className="text-lg font-bold text-black mb-1 uppercase font-mono tracking-tight">{item.title}</h3>
                                <p className="text-sm text-gray-700 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
