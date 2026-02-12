import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone, FileText } from 'lucide-react';
import { mockFAQs, mockTickets } from '../../data/profile';
import { SupportTicket } from '../../types';
import Button from '../../components/ui/Button';

const HelpCenter: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaqId, setOpenFaqId] = useState<string | null>(null);

    const filteredFAQs = mockFAQs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFaq = (id: string) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">How can we help you?</h1>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 transition text-center group">
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <MessageCircle size={28} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Chat with Us</h3>
                    <p className="text-slate-500 mb-4 text-sm">Start a live chat with our support team.</p>
                    <Button variant="outline" size="sm" fullWidth>Start Chat</Button>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 transition text-center group">
                    <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                        <Mail size={28} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Email Support</h3>
                    <p className="text-slate-500 mb-4 text-sm">Get response within 24 hours.</p>
                    <Button variant="outline" size="sm" fullWidth>Send Email</Button>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 transition text-center group">
                    <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                        <Phone size={28} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Call Us</h3>
                    <p className="text-slate-500 mb-4 text-sm">Mon-Fri from 9am to 6pm.</p>
                    <Button variant="outline" size="sm" fullWidth>1800-123-4567</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQs */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {filteredFAQs.map(faq => (
                            <div key={faq.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    {faq.question}
                                    {openFaqId === faq.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                </button>
                                {openFaqId === faq.id && (
                                    <div className="p-4 pt-0 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                                        <div className="pt-4">{faq.answer}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Tickets */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Tickets</h2>
                        <button className="text-sm text-primary-600 hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {mockTickets.map((ticket: SupportTicket) => (
                            <div key={ticket.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ticket.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                    <span className="text-xs text-slate-500">{new Date(ticket.lastUpdated).toLocaleDateString()}</span>
                                </div>
                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1 mb-1">{ticket.subject}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2">{ticket.messages[ticket.messages.length - 1].message}</p>
                            </div>
                        ))}
                        <Button fullWidth size="sm">Create New Ticket</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
