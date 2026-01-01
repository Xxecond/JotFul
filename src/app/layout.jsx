import "@/styles/globals.css";
import Script from "next/script";
import { AuthProvider } from "@/context/authContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

export const metadata = {
  title: "JotFul app",
  description: "diary app",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Google Analytics - Temporarily disabled */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LFBY2BJJ4F"
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LFBY2BJJ4F');
          `}
        </Script> */}

        <AuthProvider>
          <SettingsProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
