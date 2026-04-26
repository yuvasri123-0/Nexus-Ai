import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, Sparkles } from 'lucide-react';

const Agent = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! I am your Nexus AI Assistant. How can I help you architect your next application today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/ai/chat', { message: input });
            setMessages(prev => [...prev, { role: 'assistant', text: res.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error communicating with the AI cluster. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen ml-64 bg-background relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-start/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-background/80 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center shadow-lg">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">AI Architect</h2>
                        <p className="text-sm text-primary-end font-medium">Expert System Online</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 z-10 scroll-smooth">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex space-x-4 max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                                msg.role === 'user' ? 'bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10' : 'bg-gradient-to-br from-primary-start to-primary-end'
                            }`}>
                                {msg.role === 'user' ? <User size={20} className="text-gray-300" /> : <Bot size={20} className="text-white" />}
                            </div>
                            <div className={`p-5 rounded-2xl ${
                                msg.role === 'user' 
                                ? 'bg-card border border-white/5 text-gray-200' 
                                : 'bg-primary-start/10 border border-primary-start/20 text-white'
                            }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex space-x-4 max-w-[75%]">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center shrink-0 shadow-md">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div className="p-6 rounded-2xl bg-primary-start/10 border border-primary-start/20 flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary-end rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-primary-end rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                <div className="w-2 h-2 bg-primary-end rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-background/80 backdrop-blur-md z-10">
                <form onSubmit={handleSend} className="relative max-w-5xl mx-auto">
                    <input
                        type="text"
                        className="w-full input-field px-6 py-4 rounded-2xl pr-16 text-sm"
                        placeholder="Ask the AI architect to design a system..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Agent;
