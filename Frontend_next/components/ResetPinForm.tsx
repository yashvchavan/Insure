'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function ResetPinForm({
  userId,
  token
}: {
  userId: string;
  token: string;
}) {
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleNewPinChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    if (value && !isNaN(Number(value))) {
      const updatedPin = [...newPin];
      updatedPin[index] = value;
      setNewPin(updatedPin);
      
      if (value && index < 3) {
        const nextInput = document.getElementById(`new-pin-${index + 1}`);
        nextInput?.focus();
      }
    } else if (value === "") {
      const updatedPin = [...newPin];
      updatedPin[index] = "";
      setNewPin(updatedPin);
    }
  };

  const handleConfirmPinChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    if (value && !isNaN(Number(value))) {
      const updatedPin = [...confirmPin];
      updatedPin[index] = value;
      setConfirmPin(updatedPin);
      
      if (value && index < 3) {
        const nextInput = document.getElementById(`confirm-pin-${index + 1}`);
        nextInput?.focus();
      }
    } else if (value === "") {
      const updatedPin = [...confirmPin];
      updatedPin[index] = "";
      setConfirmPin(updatedPin);
    }
  };

  const handleSubmit = async () => {
    const enteredPin = newPin.join("");
    const enteredConfirmPin = confirmPin.join("");
    
    if (enteredPin.length !== 4 || enteredConfirmPin.length !== 4) {
      setError("Please complete both PIN fields");
      return;
    }
    
    if (enteredPin !== enteredConfirmPin) {
      setError("PINs don't match");
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/reset-pin-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          token,
          newPin: enteredPin
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/vault');
        }, 2000);
      } else {
        setError(data.error || "Failed to reset PIN");
      }
    } catch (error) {
      setError("Failed to reset PIN. Please try again.");
      console.error('Error resetting PIN:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 rounded-lg bg-green-50 text-green-800">
        <p>Your PIN has been successfully reset. Redirecting you to the vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">New PIN</label>
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3].map((index) => (
              <Input
                key={`new-${index}`}
                id={`new-pin-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-12 h-12 text-center text-xl"
                value={newPin[index]}
                onChange={(e) => handleNewPinChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Confirm New PIN</label>
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3].map((index) => (
              <Input
                key={`confirm-${index}`}
                id={`confirm-pin-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-12 h-12 text-center text-xl"
                value={confirmPin[index]}
                onChange={(e) => handleConfirmPinChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Button 
        onClick={handleSubmit}
        disabled={isLoading || newPin.some(d => d === "") || confirmPin.some(d => d === "")}
        className="w-full"
      >
        {isLoading ? "Resetting PIN..." : "Reset PIN"}
      </Button>
    </div>
  );
}