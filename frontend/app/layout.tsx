"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorNotifications from './components/ErrorNotifications'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ErrorNotifications />
      </body>
    </html>
  );
}