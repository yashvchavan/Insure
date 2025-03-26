"use client";
type SpeechRecognition = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, X, Volume2 } from "lucide-react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceNavButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const recognitionRef = useRef<null | SpeechRecognition>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start voice recording and recognition
  const handleStartListening = async () => {
    setIsListening(true);
    setTranscript("");
    setResponseMessage("");

    // Step 1: Start browser speech recognition
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
      setTranscript(text);
      setIsListening(false);
      startRecording();
    };

    recognition.onerror = () => {
      setIsListening(false);
      setTranscript("Error capturing voice. Try again.");
    };

    recognition.start();
  };

  // Step 2: Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        sendAudioToBackend(audioBlob);
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 3000); // Record for 3 seconds
    } catch (error) {
      setIsListening(false);
      setTranscript("Microphone access denied.");
    }
  };

  // Step 3: Send recorded audio to backend
  const sendAudioToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");

    try {
      const response = await fetch("http://127.0.0.1:5000/voice-command", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setResponseMessage(data.response.message || "Processing...");
      if (data.audio_file) {
        setAudioSrc(`http://127.0.0.1:5000/get-audio/${data.audio_file}`);
      }
    } catch (error) {
      setResponseMessage("Failed to process command.");
    }
  };

  return (
    <>
      <motion.button
        className="h-12 w-12 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Mic className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-20 w-[300px] h-[350px] bg-card rounded-xl shadow-xl border overflow-hidden z-50 flex flex-col"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Voice Navigation</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6">
              {isListening ? (
                <div className="text-center">
                  <Volume2 className="h-10 w-10 text-primary animate-pulse" />
                  <p className="text-muted-foreground mt-3">Listening...</p>
                </div>
              ) : transcript ? (
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium">"{transcript}"</p>
                  {responseMessage && <p className="text-primary">{responseMessage}</p>}
                  {audioSrc && <audio src={audioSrc} controls autoPlay />}
                </div>
              ) : (
                <Button size="lg" className="rounded-full h-16 w-16" onClick={handleStartListening}>
                  <Mic className="h-6 w-6" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
