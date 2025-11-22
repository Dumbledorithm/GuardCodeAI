// File: app/components/Header.tsx

"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const Header = () => {
    const { data: session, status } = useSession();

    return (
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 border-b border-gray-800">
                <div className="flex items-center space-x-4">
                    <span className="font-bold text-xl text-white">GuardCode</span>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                    <a href="#" className="text-sm font-medium text-gray-400 hover:text-white">Features</a>
                    <a href="#" className="text-sm font-medium text-gray-400 hover:text-white">Pricing</a>
                    <a href="#" className="text-sm font-medium text-gray-400 hover:text-white">Docs</a>
                </nav>
                <div>
                    {status === 'loading' ? (
                        <div className="h-10 w-24 bg-gray-700 rounded-md animate-pulse"></div>
                    ) : session ? (
                        <div className="flex items-center gap-4">
                            <Image
                                src={session.user?.image!}
                                alt={session.user?.name || 'User avatar'}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <Button variant="default" onClick={() => signOut()}>Sign Out</Button>
                        </div>
                    ) : (
                        <Button variant="default" onClick={() => signIn('github')}>Sign In with GitHub</Button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;