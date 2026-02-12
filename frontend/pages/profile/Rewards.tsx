import React from 'react';
import { Gift, Clock, CheckCircle } from 'lucide-react';
import { mockRewards } from '../../data/profile';
import { RewardTransaction } from '../../types';

const Rewards: React.FC = () => {
    // Calculate total points
    const totalPoints = 450; // In real app, calculate from transactions or fetch from API

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Rewards</h1>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-amber-100 font-medium mb-1">Current Balance</p>
                        <h2 className="text-5xl font-bold">{totalPoints}</h2>
                        <p className="text-sm text-amber-100 mt-2">NV Coins</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                        <Gift size={48} className="text-white" />
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20 flex gap-6">
                    <div>
                        <p className="text-2xl font-bold">₹{totalPoints}</p>
                        <p className="text-xs text-amber-100">Wallet Value</p>
                    </div>
                    <div className="w-px bg-white/20"></div>
                    <div>
                        <p className="text-2xl font-bold">Gold</p>
                        <p className="text-xs text-amber-100">Membership Tier</p>
                    </div>
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">History</h2>

                <div className="space-y-4">
                    {mockRewards.map((transaction: RewardTransaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'earned'
                                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                                        : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                                    }`}>
                                    {transaction.type === 'earned' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{transaction.description}</p>
                                    <p className="text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${transaction.type === 'earned' ? 'text-green-600' : 'text-slate-600 dark:text-slate-400'
                                }`}>
                                {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">Refer a Friend</h3>
                    <p className="text-indigo-100 text-sm mb-4">Earn 500 points for every friend you refer who makes a purchase.</p>
                    <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition">Copy Referral Link</button>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">Review Products</h3>
                    <p className="text-pink-100 text-sm mb-4">Earn 50 points for every product review you write.</p>
                    <button className="bg-white text-pink-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-pink-50 transition">Write Reviews</button>
                </div>
            </div>
        </div>
    );
};

export default Rewards;
