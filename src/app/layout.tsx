// src/app/layout.tsx

import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import NavBar from './components/Navbar';

import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider>
          <NavBar />
          <main className="content-with-navbar-padding">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
