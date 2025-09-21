import React, { createContext, useContext, useState, useCallback } from 'react';

interface NotificationContextType {
  showNotification: (title: string, body: string) => void;
  requestPermission: () => Promise<void>;
  hasPermission: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [hasPermission, setHasPermission] = useState(
    'Notification' in window && Notification.permission === 'granted'
  );

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      setHasPermission(true);
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
    }
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if (!hasPermission || !('Notification' in window)) {
      // Fallback to console log or other notification method
      console.log(`Notification: ${title} - ${body}`);
      return;
    }

    const notification = new Notification(title, {
      body,
      icon: '/vite.svg', // You can replace this with a custom icon
      badge: '/vite.svg',
      tag: 'pomodoro-timer',
      requireInteraction: false,
    });

    // Auto-close notification after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }, [hasPermission]);

  const value = {
    showNotification,
    requestPermission,
    hasPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};