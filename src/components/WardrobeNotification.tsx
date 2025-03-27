'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WardrobeNotificationProps {
  itemCount: number;
  orderId?: string;
  onDismiss?: () => void;
  autoHideDelay?: number; // Time in ms to auto-hide notification
}

export default function WardrobeNotification({
  itemCount,
  orderId,
  onDismiss,
  autoHideDelay = 10000, // Default 10 seconds
}: WardrobeNotificationProps) {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Reset visibility when item count changes
    setVisible(true);
    setIsExiting(false);
    
    // Set auto-hide timer
    if (autoHideDelay > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [itemCount, autoHideDelay, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    // Wait for animation to complete before fully removing
    setTimeout(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    }, 400); // Match animation duration
  };

  // Don't render if not visible
  if (!visible || itemCount <= 0) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-md bg-white border border-green-200 rounded-lg shadow-lg p-4 ${isExiting ? 'animate-slideDown' : 'animate-slideUp'}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-green-800">Added to your wardrobe!</h3>
          <div className="mt-1 text-sm text-gray-700">
            <p>{itemCount} {itemCount === 1 ? 'item has' : 'items have'} been added to your wardrobe from your order{orderId ? ` #${orderId}` : ''}.</p>
            <div className="mt-2">
              <Link href="/wardrobe" className="text-sm font-medium text-green-600 hover:text-green-500">
                View in wardrobe <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            type="button"
            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={handleDismiss}
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 