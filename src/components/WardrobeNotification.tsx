'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WardrobeNotificationProps {
  itemCount: number;
  orderId?: string;
  message?: string;
  type?: 'success' | 'error';
  onDismiss?: () => void;
  autoHideDelay?: number;
}

export default function WardrobeNotification({
  itemCount,
  orderId,
  message,
  type = 'success',
  onDismiss,
  autoHideDelay = 10000, // Default 10 seconds
}: WardrobeNotificationProps) {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Reset visibility when notification changes
    setVisible(true);
    setIsExiting(false);
    
    // Set auto-hide timer
    if (autoHideDelay > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [itemCount, message, autoHideDelay]);

  const handleDismiss = () => {
    setIsExiting(true);
    // Wait for animation to complete before fully removing
    setTimeout(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    }, 400); // Match animation duration
  };

  // Don't render if not visible
  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-400 transform ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      } ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
    >
      <div className="flex items-start">
        <div className="flex-1">
          {message ? (
            <p className="text-sm font-medium">{message}</p>
          ) : (
            <>
              <p className="text-sm font-medium">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} added to your wardrobe
              </p>
              {orderId && (
                <p className="text-xs mt-1">
                  Order ID: {orderId}
                </p>
              )}
            </>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className={`ml-4 text-sm font-medium ${
            type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
          }`}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
} 