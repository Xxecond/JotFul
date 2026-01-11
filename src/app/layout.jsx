import "@/styles/globals.css";
import Script from "next/script";
import { AuthProvider } from "@/context/authContext";
import { UserProvider } from "@/context/UserContext";
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
        <AuthProvider>
          <UserProvider>
            <SettingsProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </SettingsProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
