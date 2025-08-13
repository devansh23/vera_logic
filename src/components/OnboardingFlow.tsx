'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import GmailConnectButton from './GmailConnectButton';

interface OnboardingFlowProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [gmailConnected, setGmailConnected] = useState(false);

  const handleGmailSuccess = () => {
    setGmailConnected(true);
    setCurrentStep(3);
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  };

  const handleGmailError = (error: string) => {
    console.error('Gmail connection error:', error);
    // Stay on current step, user can retry
  };

  const handleSkip = () => {
    onSkip?.();
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome to Vera!</h2>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Gmail</h3>
              <p className="text-gray-600 mb-6">
                Connect your Gmail account to automatically process order confirmation emails 
                and track your purchases from online retailers like Myntra, Zara, and H&M.
              </p>
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">One-Click Connection</h3>
              <p className="text-gray-600 mb-6">
                Click the button below to securely connect your Gmail account. 
                We'll only access emails you choose to share.
              </p>
              
              <div className="mb-6">
                <GmailConnectButton
                  onSuccess={handleGmailSuccess}
                  onError={handleGmailError}
                  variant="primary"
                  size="large"
                  className="w-full"
                />
              </div>

              <div className="text-sm text-gray-500">
                <p>• Secure OAuth 2.0 authentication</p>
                <p>• We never store your Gmail password</p>
                <p>• You can disconnect anytime from settings</p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gmail Connected Successfully!</h3>
              <p className="text-gray-600 mb-4">
                Your Gmail account is now connected. Vera will automatically process 
                your order confirmation emails and add items to your wardrobe.
              </p>
              <div className="animate-pulse text-green-600 font-medium">
                Redirecting to your dashboard...
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          {currentStep < 3 && (
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 