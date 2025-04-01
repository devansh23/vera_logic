'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import WardrobeNotification from '@/components/WardrobeNotification';

interface NotificationData {
  itemCount: number;
  orderId?: string;
  message?: string;
  type?: string;
}

interface WardrobeNotificationContextType {
  showNotification: (data: NotificationData) => void;
  hideNotification: () => void;
}

const WardrobeNotificationContext = createContext<WardrobeNotificationContextType | undefined>(undefined);

export function useWardrobeNotification() {
  const context = useContext(WardrobeNotificationContext);
  if (context === undefined) {
    throw new Error('useWardrobeNotification must be used within a WardrobeNotificationProvider');
  }
  return context;
}

interface WardrobeNotificationProviderProps {
  children: ReactNode;
}

export function WardrobeNotificationProvider({ children }: WardrobeNotificationProviderProps) {
  const [notification, setNotification] = useState<NotificationData | null>(null);

  const showNotification = (data: NotificationData) => {
    // Show notification regardless of itemCount for general notifications
    setNotification(data);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <WardrobeNotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && (
        <WardrobeNotification
          itemCount={notification.itemCount}
          orderId={notification.orderId}
          message={notification.message}
          type={notification.type}
          onDismiss={hideNotification}
        />
      )}
    </WardrobeNotificationContext.Provider>
  );
} 