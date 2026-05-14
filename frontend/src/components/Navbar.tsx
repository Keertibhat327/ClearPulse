'use client';

import Link from 'next/link';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';

export default function Navbar() {
    const { isSignedIn } = useUser();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-[rgba(99,102,241,0.1)]" style={{ borderRadius: 0 }}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    {/* Logo mark: pulse line + circle */}
                    <svg width="38" height="28" viewBox="0 0 38 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        {/* Flat baseline */}
                        <path d="M1 14 H8" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
                        {/* Pulse spike */}
                        <path d="M8 14 L12 5 L16 22 L20 10 L23 14" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Flat tail */}
                        <path d="M23 14 H29" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
                        {/* Circle at end — the "pulse dot" */}
                        <circle cx="33" cy="14" r="4" fill="#6366f1" opacity="0.15"/>
                        <circle cx="33" cy="14" r="2.2" fill="#6366f1"/>
                    </svg>
                    {/* Wordmark */}
                    <span className="text-[1.1rem] font-bold tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors">
                        Clear<span className="text-indigo-500">Pulse</span>
                    </span>
                </Link>

                <div className="flex items-center gap-5">
                    {isSignedIn ? (
                        <>
                            <Link href="/triage" className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">Triage Chat</Link>
                            <Link href="/patient" className="text-sm text-gray-400 hover:text-white transition-colors">Patient</Link>
                            <Link href="/doctor" className="text-sm text-gray-400 hover:text-white transition-colors">Doctor</Link>
                            <div className="flex items-center gap-3">
                                <UserButton />
                            </div>
                        </>
                    ) : (
                        <SignInButton mode="modal">
                            <button className="btn-primary text-sm !px-5 !py-2.5" suppressHydrationWarning>
                                Get Started
                            </button>
                        </SignInButton>
                    )}
                </div>
            </div>
        </nav>
    );
}
