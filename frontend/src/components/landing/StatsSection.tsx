'use client';

import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';

interface Stat {
    id: number;
    name: string;
    value: string;
    numericValue: number;
    suffix: string;
    prefix: string;
    color: string;
}

interface StatsSectionProps {
    stats: Stat[];
}

function AnimatedCounter({ target, prefix, suffix, isVisible }: { target: number; prefix: string; suffix: string; isVisible: boolean }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        let frame: number;

        const animate = () => {
            start += increment;
            if (start >= target) {
                setCount(target);
                return;
            }
            setCount(Math.floor(start));
            frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [isVisible, target]);

    const formatted = target >= 1000
        ? `${(count / 1000).toFixed(count >= target ? 1 : 0)}K`
        : count.toLocaleString();

    return (
        <span>{prefix}{target >= 1000 ? formatted : count.toLocaleString()}{suffix}</span>
    );
}

export default function StatsSection({ stats }: StatsSectionProps) {
    const { ref, isInView } = useInView({ threshold: 0.3 });

    return (
        <section ref={ref} className="py-16 px-6 border-y-2 border-black bg-[#fdfbf7] relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, black 0px, black 1px, transparent 1px, transparent 12px)',
                }} />

            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                {stats.map((stat, index) => (
                    <div
                        key={stat.id}
                        className={`text-center transition-all duration-700 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <p className="text-4xl md:text-5xl font-black font-mono mb-2 text-black">
                            <AnimatedCounter
                                target={stat.numericValue}
                                prefix={stat.prefix}
                                suffix={stat.suffix}
                                isVisible={isInView}
                            />
                        </p>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">{stat.name}</p>
                        <div className={`h-1 w-12 mx-auto ${stat.color}`} />
                    </div>
                ))}
            </div>
        </section>
    );
}
