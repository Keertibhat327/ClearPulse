'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';

export default function ResearchPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Research Hub</h1>
                <p className="text-gray-600 mt-2">Coming Soon.</p>
            </div>
        </main>
    );
}
