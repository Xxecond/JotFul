'use client';

import { AuthProvider } from "@/context/authContext";
import { UserProvider } from "@/context/UserContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { FolderProvider } from "@/contexts/FolderContext";
import { GuestProvider } from "@/contexts/GuestContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <UserProvider>
        <SettingsProvider>
          <NotificationProvider>
            <FolderProvider>
              <GuestProvider>
                {children}
              </GuestProvider>
            </FolderProvider>
          </NotificationProvider>
        </SettingsProvider>
      </UserProvider>
    </AuthProvider>
  );
}