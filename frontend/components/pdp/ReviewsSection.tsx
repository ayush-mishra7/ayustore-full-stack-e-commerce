import React from 'react';
import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { Review } from '../../types';

interface ReviewsSectionProps {
    reviews: Review[];
    rating: number;
    totalReviews: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, rating, totalReviews }) => {
    // Mock breakdown data
    const breakdown = [65, 20, 10, 3, 2]; // Percentages for 5, 4, 3, 2, 1 stars

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Ratings & Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                {/* Summary */}
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">{rating}</div>
                    <div className="flex text-yellow-400 gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={20} fill={i < Math.floor(rating) ? "currentColor" : "none"} className={i >= Math.floor(rating) ? "text-slate-200 dark:text-slate-600" : ""} />
                        ))}
                    </div>
                    <p className="text-slate-500 text-sm">{totalReviews} Verified Ratings</p>
                </div>

                {/* Breakdown bars */}
                <div className="col-span-2 space-y-3">
                    {breakdown.map((percent, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <span className="text-sm font-medium w-3">{5 - idx}</span>
                            <Star size={12} className="text-slate-400" fill="currentColor" />
                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${percent}%` }}></div>
                            </div>
                            <span className="text-xs text-slate-400 w-8 text-right">{percent}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-100 dark:border-slate-700 pb-6 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                {review.rating} <Star size={10} fill="currentColor" />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white truncate">{review.comment.substring(0, 30)}...</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                            {review.comment}
                        </p>

                        {/* Review Images Mock */}
                        {/* <div className="flex gap-2 mb-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg"></div>
                    <div className="w-16 h-16 bg-slate-100 rounded-lg"></div>
                </div> */}

                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-slate-700 dark:text-slate-400">{review.userName}</span>
                                {review.isVerifiedPurchase && (
                                    <span className="flex items-center gap-1 text-slate-400">
                                        <CheckCircle size={12} /> Certified Buyer
                                    </span>
                                )}
                                <span>{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            <button className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition">
                                <ThumbsUp size={14} /> <span>{review.helpfulCount}</span>
                            </button>
                        </div>
                    </div>
                ))}

                <button className="w-full text-primary-600 font-bold text-sm hover:underline py-2">See all reviews</button>
            </div>
        </div>
    );
};

export default ReviewsSection;
