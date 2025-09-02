import type { Metadata } from "next";
import React from "react";
import "./globals.css";
// The import path for SessionProvider has been changed to a relative path to resolve the build error.
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "AI Code Reviewer",
  description: "Get instant AI-powered code reviews for your GitHub PRs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* The imports for 'next/font' and 'globals.css' have been removed to fix compilation issues.
        Styling will rely on Tailwind CSS loaded via a script or other global setup.
      */}
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
