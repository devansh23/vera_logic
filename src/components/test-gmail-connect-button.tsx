'use client';

import { useState } from 'react';
import GmailConnectButton from './GmailConnectButton';

export default function TestGmailConnectButton() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSuccess = () => {
    setStatus('success');
    setMessage('Gmail connection successful!');
  };

  const handleError = (error: string) => {
    setStatus('error');
    setMessage(error);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gmail Connect Button Test</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Default (Primary, Medium)</h2>
        <GmailConnectButton 
          onSuccess={handleSuccess} 
          onError={handleError}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Secondary, Small</h2>
        <GmailConnectButton 
          variant="secondary"
          size="small" 
          onSuccess={handleSuccess} 
          onError={handleError}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Outline, Large</h2>
        <GmailConnectButton 
          variant="outline"
          size="large" 
          onSuccess={handleSuccess} 
          onError={handleError}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Custom Class</h2>
        <GmailConnectButton 
          className="w-full justify-between px-8 font-bold"
          onSuccess={handleSuccess} 
          onError={handleError}
        />
      </div>
      
      {status !== 'idle' && (
        <div className={`p-4 rounded-md ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-semibold">{status === 'success' ? 'Success!' : 'Error:'}</p>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
} 