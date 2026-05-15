'use client';

import Link from 'next/link';
import { Github, Twitter, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative py-16 px-6 bg-[#fdfbf7] border-t-2 border-black">
            {/* Gradient top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-retro-accent-pink via-retro-accent-green to-retro-accent-yellow" />

            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <svg width="38" height="28" viewBox="0 0 38 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M1 14 H8" stroke="url(#footer-pulse-grad)" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M8 14 L12 5 L16 22 L20 10 L23 14" stroke="url(#footer-pulse-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M23 14 H29" stroke="url(#footer-pulse-grad)" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="33" cy="14" r="4" fill="#c084fc" opacity="0.2"/>
                                <circle cx="33" cy="14" r="2.2" fill="url(#footer-pulse-grad)"/>
                                <defs>
                                    <linearGradient id="footer-pulse-grad" x1="1" y1="14" x2="38" y2="14" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#818cf8" />
                                        <stop offset="100%" stopColor="#c084fc" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="text-lg font-bold text-gray-900 font-mono">
                                Clear<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-400">Pulse</span> AI
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                            AI-powered medical analysis secured via IPFS. Your health data, your control.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-black mb-4 font-mono border-b-2 border-black pb-2 inline-block">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Patient Portal', href: '/register?role=patient' },
                                { label: 'Doctor Portal', href: '/register?role=doctor' },
                                { label: 'Features', href: '#features' },
                                { label: 'Research', href: '/research' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-gray-600 font-medium hover:text-black hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group no-underline hover:no-underline">
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Connect */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-black mb-4 font-mono border-b-2 border-black pb-2 inline-block">Stay Updated</h4>
                        <p className="text-sm text-gray-600 font-medium mb-4">Get the latest updates on decentralized healthcare.</p>
                        <div className="flex gap-0">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="!w-auto flex-1 !py-2 !px-3 !text-xs !shadow-none !border-r-0"
                            />
                            <button className="btn-primary !py-2 !px-4 !text-xs !shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                <Mail className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 mt-6">
                            {[
                                { icon: Github, href: '#', label: 'GitHub' },
                                { icon: Twitter, href: '#', label: 'Twitter' },
                            ].map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 no-underline"
                                    >
                                        <Icon className="w-4 h-4 text-black" strokeWidth={2} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="section-divider mb-6" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500 font-medium">© {new Date().getFullYear()} ClearPulse AI. For educational purposes only. Not medical advice.</p>
                    <p className="text-xs text-gray-400 font-mono">Built with ❤️ for healthcare</p>
                </div>
            </div>
        </footer>
    );
}
