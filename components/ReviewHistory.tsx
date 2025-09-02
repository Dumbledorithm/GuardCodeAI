"use client";

interface Review {
    repo: string;
    prTitle: string;
    qualityScore: number;
    createdAt: string;
}

interface ReviewHistoryProps {
    reviews: Review[];
}

export const ReviewHistory = ({ reviews }: ReviewHistoryProps) => {
    if (reviews.length === 0) return null;

    return (
        <div className="space-y-4">
            {reviews.slice(0, 5).map((review, index) => (
                <div key={index} className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-white">{review.repo}</p>
                            <p className="text-sm text-gray-400">{review.prTitle}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-teal-400">{review.qualityScore}/100</p>
                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
