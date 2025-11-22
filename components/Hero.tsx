import React from 'react';
import { ShieldCheck } from './Icons';

export const Hero = () => (
    <div className="text-center py-16 sm:py-24">
        <div className="inline-flex items-center rounded-full bg-gray-900/70 p-1 pr-4 mb-4 border border-gray-800">
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                <ShieldCheck className="inline h-4 w-4 mr-1" />
                Secure
            </span>
            <span className="ml-3 text-sm text-gray-300">Your code is never stored or shared</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tighter text-white">
            Ship Flawless Code, Faster.
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Get instant, expert-level feedback on your code. Our AI reviewer analyzes for bugs, best practices, and performance issues so you can merge with confidence.
        </p>
    </div>
);
