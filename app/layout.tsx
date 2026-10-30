import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Salomon · Your personal AI',description:'A little clarity. A little possibility. Your personal AI assistant for phone and computer.',icons:{icon:'/favicon.svg'},manifest:'/manifest.webmanifest',appleWebApp:{capable:true,title:'Salomon',statusBarStyle:'black-translucent'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
