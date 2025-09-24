import type { Metadata } from "next";
import "./globals.css";
// import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";
import MobileViewProvider from "@/components/MobileViewProvider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Way Of Flower",
  description: "Way Of Flower decentralized garden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={"antialiased"}
      >
        <AuthProvider>
          <MobileViewProvider>
            {children}
          </MobileViewProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
