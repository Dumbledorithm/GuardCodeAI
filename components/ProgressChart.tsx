"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Review {
    createdAt: string;
    qualityScore: number;
}

interface ProgressChartProps {
    data: Review[];
}

export const ProgressChart = ({ data }: ProgressChartProps) => {
    const getTime = (createdAt: any) => {
        // Handle Firestore Timestamp objects ({ seconds }) or ISO/date strings
        if (!createdAt) return 0;
        if (typeof createdAt === 'object' && 'seconds' in createdAt) {
            return createdAt.seconds * 1000;
        }
        const t = new Date(createdAt).getTime();
        return isNaN(t) ? 0 : t;
    };

    const formattedData = data
        .map(review => ({
            ...review,
            date: new Date(getTime(review.createdAt)).toLocaleDateString(),
            qualityScore: Number(review.qualityScore) || 0,
            _ts: getTime(review.createdAt),
        }))
        .sort((a, b) => a._ts - b._ts); // oldest first

    if (data.length === 0) {
        return <p className="text-center text-gray-400">No review history yet. Review a PR to start tracking your progress!</p>;
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="date" stroke="#A0AEC0" />
                    <YAxis domain={[0, 100]} stroke="#A0AEC0" />
                    <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                    <Legend />
                    <Line type="monotone" dataKey="qualityScore" name="Code Quality Score" stroke="#38B2AC" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};