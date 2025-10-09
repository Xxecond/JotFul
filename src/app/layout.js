import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blogger app",
  description: "blogging app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <head>
      
         </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
