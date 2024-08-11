'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { Providers } from './provider';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true} data-theme="light">
            <body className={inter.className}>
                <SessionProvider>
                    <Providers>{children}</Providers>
                </SessionProvider>
            </body>
        </html>
    );
}
