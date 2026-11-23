import type { Metadata } from 'next';
import {LanguageProvider} from '../components/language';
import {SoundProvider} from '../components/sound-provider';
import './fonts.css';
import './globals.css';
export const metadata: Metadata = { title: 'Ruslan Melkumyan — Designer', description: 'Multimedia design, branding and digital products. Portfolio of Ruslan Melkumyan.' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body><LanguageProvider><SoundProvider>{children}</SoundProvider></LanguageProvider></body></html>; }
