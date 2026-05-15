'use client';

import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import { ArrowRight } from 'lucide-react';

export default function VideoSection() {
    const { ref, isInView } = useInView({ threshold: 0.2 });

    return (
        <section ref={ref} className="relative py-36 px-6 overflow-hidden border-b-2 border-black">
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://cdn.prod.website-files.com/68c8e57d6e512b9573db146f%2F6902ce6861ec08546c002822_Grid%20Animation%20Loop%20Reverse-transcode.mp4" type="video/mp4" />
                </video>
                {/* Multi-layer overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-transparent to-pink-900/20" />
            </div>

            <div className={`relative z-10 max-w-4xl mx-auto text-center text-white transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-block mb-8">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-retro-accent-green font-mono border border-retro-accent-green/30 px-4 py-2">
                        The Vision
                    </span>
                </div>
                <h2 className="text-4xl md:text-7xl font-black mb-6 drop-shadow-lg leading-tight">
                    The Future of Health is{' '}
                    <span className="relative inline-block">
                        <span className="gradient-text-animated">Decentralized</span>
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-retro-accent-green" />
                    </span>
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                    Experience a new era where AI meets Healthcare. Secure, intelligent, and completely in your control.
                </p>
                <Link
                    href="/register"
                    className="group inline-flex items-center gap-3 px-10 py-5 bg-retro-accent-yellow border-2 border-black text-black font-bold uppercase text-lg shadow-[6px_6px_0px_0px_white] hover:shadow-[2px_2px_0px_0px_white] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                >
                    Join the Revolution
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </section>
    );
}
