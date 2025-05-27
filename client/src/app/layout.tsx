import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import MuiThemeProvider from '@/components/templates/mui'
import MessagePopupProvider from '@/components/shared/MessagePopup/MessagePopupProvider'

import favicon from './favicon.ico'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Worth Boards',
    description: 'Manage your tasks with ease',
    icons: favicon.src
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <MuiThemeProvider>
                    <MessagePopupProvider>
                        {children}
                    </MessagePopupProvider>
                </MuiThemeProvider>
            </body>
        </html>
    )
}
