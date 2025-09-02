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
    const formattedData = data
        .map(review => ({
            ...review,
            date: new Date(review.createdAt).toLocaleDateString(),
        }))
        .reverse(); // Show oldest first

    if (data.length === 0) {
        return <p className="text-center text-gray-400">No review history yet. Review a PR to start tracking your progress!</p>;
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
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