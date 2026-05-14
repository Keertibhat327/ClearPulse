'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function TriagePage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello, I am your Emergency Triage Assistant. Could you please describe the symptoms you are experiencing?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [triageLevel, setTriageLevel] = useState<'Assessing' | 'Home' | 'Clinic' | 'Emergency'>('Assessing');
    const [recommendedAction, setRecommendedAction] = useState('');
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || !isSignedIn) return;

        const userMessage = input.trim();
        setInput('');
        
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
                apiUrl = 'http://' + apiUrl;
            }
            const response = await fetch(`${apiUrl}/api/triage/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_id: user?.id || 'anonymous',
                    message: userMessage,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                })
            });

            if (!response.ok) throw new Error('Failed to get triage response');
            
            const data = await response.json();
            
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            setTriageLevel(data.triage_level);
            setRecommendedAction(data.recommended_action);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error connecting to the triage service. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (isLoaded && !isSignedIn) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] pt-24 px-6 flex items-center justify-center">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 text-center max-w-md">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Triage Assistant</h2>
                    <p className="text-gray-500 mb-6">Please sign in to securely chat with the AI Triage Assistant and assess your symptoms.</p>
                    <SignInButton mode="modal">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition w-full">
                            Sign In to Start
                        </button>
                    </SignInButton>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-8 px-4 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
            {/* Chat Interface */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-[80vh]">
                <div className="bg-blue-600 p-5 text-white flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                        🏥
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-tight">AI Triage Assistant</h2>
                        <p className="text-blue-100 text-xs">Powered by Gemini - For informational use only</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                                m.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none p-4 max-w-[80%] flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={endOfMessagesRef} />
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Describe your symptoms (e.g. 'I have a mild headache since yesterday')..."
                            className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isTyping}
                            suppressHydrationWarning
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 rounded-xl font-medium transition"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>

            {/* Assessment Panel */}
            <div className="md:w-[350px] space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 h-full">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 border-b pb-2">Status Assessment</h3>
                    
                    <div className="mb-8">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-2">Triage Level</p>
                        {triageLevel === 'Assessing' && (
                            <div className="bg-gray-50 border border-gray-200 text-gray-600 rounded-xl p-4 flex items-center gap-3">
                                <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                                <span className="font-semibold text-sm">Evaluating Symptoms...</span>
                            </div>
                        )}
                        {triageLevel === 'Home' && (
                            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 flex items-center gap-3">
                                <span className="text-2xl">🏡</span>
                                <span className="font-bold text-lg">Home Care</span>
                            </div>
                        )}
                        {triageLevel === 'Clinic' && (
                            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-4 flex items-center gap-3">
                                <span className="text-2xl">🩺</span>
                                <span className="font-bold text-lg">Clinic Visit Needed</span>
                            </div>
                        )}
                        {triageLevel === 'Emergency' && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3 animate-pulse">
                                <span className="text-2xl">🚨</span>
                                <span className="font-bold text-lg">Emergency</span>
                            </div>
                        )}
                    </div>

                    {recommendedAction && (
                        <div className="mb-8">
                            <p className="text-xs text-gray-400 uppercase font-bold mb-2">Recommended Action</p>
                            <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {recommendedAction}
                            </p>
                        </div>
                    )}

                    {triageLevel === 'Clinic' && (
                        <Link href="/patient/book" className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-sm">
                            Book Doctor Appointment
                        </Link>
                    )}
                    
                    {triageLevel === 'Emergency' && (
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-sm shadow-red-200 flex items-center justify-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            Call Emergency Services
                        </button>
                    )}
                    
                    <div className="mt-8 text-[10px] text-gray-400 text-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <strong>Disclaimer:</strong> This AI assistant provides general informational triage and does not substitute professional medical advice, diagnosis, or treatment. Always seek the advice of a physician or other qualified health provider with any questions you may have regarding a medical condition.
                    </div>
                </div>
            </div>
        </div>
    );
}
