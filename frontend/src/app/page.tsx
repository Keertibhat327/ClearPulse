'use client';

import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import VideoSection from '@/components/landing/VideoSection';
import FeatureGrid from '@/components/landing/FeatureGrid';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import Footer from '@/components/landing/Footer';

const stats = [
  { id: 1, name: 'Reports Analyzed', value: '12,400+', numericValue: 12400, suffix: '+', prefix: '', color: 'bg-retro-accent-pink' },
  { id: 2, name: 'Active Patients', value: '3,200+', numericValue: 3200, suffix: '+', prefix: '', color: 'bg-retro-accent-green' },
  { id: 3, name: 'AI Accuracy Rate', value: '98.7%', numericValue: 98, suffix: '%', prefix: '', color: 'bg-retro-accent-yellow' },
  { id: 4, name: 'Doctors On-Chain', value: '840+', numericValue: 840, suffix: '+', prefix: '', color: 'bg-indigo-300' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-grid">
      <HeroSection />
      <StatsSection stats={stats} />
      <VideoSection />
      <FeatureGrid />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}
