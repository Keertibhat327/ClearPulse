'use client';

import Link from 'next/link';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';

export default function Navbar() {
    const { isSignedIn } = useUser();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-[rgba(99,102,241,0.1)]" style={{ borderRadius: 0 }}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold gradient-text">MediChain AI</span>
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
                            <button className="btn-primary text-sm !px-5 !py-2.5">
                                Get Started
                            </button>
                        </SignInButton>
                    )}
                </div>
            </div>
        </nav>
    );
}
