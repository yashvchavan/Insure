"use client";
type SpeechRecognition = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, X, Volume2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuth from "@/context/store"

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceNavButton() {
  const { activeModal, setActiveModal } = useAuth()
  const isOpen = activeModal === 'voice'

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);
  const recognitionRef = useRef<null | SpeechRecognition>(null);
  const router = useRouter();

  const resetState = () => {
    setTranscript("");
    setResponseMessage("");
    setHasAttempted(false);
  };

  // Start voice recognition
  const handleStartListening = async () => {
    setIsListening(true);
    resetState();

    // Start browser speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsListening(false);
      setTranscript("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      console.log("🎤 Speech recognized:", text);
      setTranscript(text);
      setIsListening(false);
      setHasAttempted(true);
      
      // Process the command directly
      processVoiceCommand(text);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setTranscript("Error capturing voice. Please try again.");
      setHasAttempted(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      setIsListening(false);
      setTranscript("Failed to start voice recognition. Please try again.");
      setHasAttempted(true);
    }
  };

  // Process voice command directly
  const processVoiceCommand = async (text: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_VOICE_NAV_API_URL || "http://127.0.0.1:5001";
      const response = await fetch(`${apiUrl}/test-command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      
      if (data.response && data.response.type === "navigation") {
        // Handle navigation
        setResponseMessage(data.response.message || "Navigating...");
        
        // Add slight delay for better UX
        setTimeout(() => {
          router.push(data.response.destination);
          setActiveModal(null);
        }, 1500);
      } else if (data.response && data.response.type === "response") {
        // Handle regular response
        setResponseMessage(data.response.message || "Processing...");
      } else {
        setResponseMessage("Failed to process command.");
      }
    } catch (error) {
      console.error("Backend communication error:", error);
      setResponseMessage("Failed to process command. Please try again.");
    }
  };

  return (
    <>
      <motion.button
        className="h-12 w-12 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setActiveModal(isOpen ? null : 'voice')}
      >
        <Mic className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-20 w-[300px] h-[400px] bg-card rounded-xl shadow-xl border overflow-hidden z-50 flex flex-col"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Voice Navigation</h3>
              <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6">
              {isListening ? (
                <div className="text-center">
                  <Volume2 className="h-10 w-10 text-primary animate-pulse" />
                  <p className="text-muted-foreground mt-3">Listening...</p>
                  <p className="text-xs text-muted-foreground mt-2">Speak clearly into your microphone</p>
                </div>
              ) : transcript ? (
                <div className="text-center space-y-4 w-full">
                  <p className="text-lg font-medium">"{transcript}"</p>
                  {responseMessage && <p className="text-primary">{responseMessage}</p>}
                  
                  {/* Retry button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleStartListening}
                    className="mt-4"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : hasAttempted ? (
                <div className="text-center space-y-4 w-full">
                  <p className="text-muted-foreground">Voice recognition failed</p>
                  <Button 
                    size="lg" 
                    onClick={handleStartListening}
                    className="rounded-full h-16 w-16"
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Try saying: "policy", "claims", "vault", "health insurance"
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <Button size="lg" className="rounded-full h-16 w-16" onClick={handleStartListening}>
                    <Mic className="h-6 w-6" />
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Try saying: "policy", "claims", "vault", "health insurance"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
