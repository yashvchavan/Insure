"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageSquare, X, Send, Mic, Volume2, VolumeX } from "lucide-react"
import { Input } from "@/components/ui/input"
import useAuth from "@/context/store"

export default function ChatbotButton() {
  const { activeModal, setActiveModal } = useAuth()
  const isOpen = activeModal === 'chatbot'
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; action?: string; url?: string }[]>([
    { text: "Hello! I'm your AI assistant. How can I help you with insurance today?", isUser: false },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState({
    recognition: false,
    synthesis: false
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)

  // Check for speech API support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setSpeechSupported({
        recognition: !!SpeechRecognition,
        synthesis: 'speechSynthesis' in window
      })
      synthesisRef.current = window.speechSynthesis
    }
  }, [])

  // Auto-scroll and speak new bot messages
  useEffect(() => {
    scrollToBottom()
    
    // Speak the latest bot message if not from user
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage?.isUser && speechSupported.synthesis) {
      speak(lastMessage.text)
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const speak = (text: string) => {
    if (!speechSupported.synthesis) return
    
    // Cancel any ongoing speech
    synthesisRef.current?.cancel()
    setIsSpeaking(true)
    
    const utterance = new SpeechSynthesisUtterance(text)
    
    utterance.onend = () => {
      setIsSpeaking(false)
    }
    
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event)
      setIsSpeaking(false)
    }
    
    synthesisRef.current?.speak(utterance)
  }

  const stopSpeaking = () => {
    synthesisRef.current?.cancel()
    setIsSpeaking(false)
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
  
    const userMessage = { text: text, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
  
    try {
      const apiUrl = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:5000/api/chat";
      
      // Debug logging
      console.log("Chatbot API URL:", apiUrl);
      console.log("Environment variable:", process.env.NEXT_PUBLIC_CHATBOT_API_URL);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: text }),
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Response data:", data);
      
      // Regular response handling (no navigation)
      const botMessage = { 
        text: data.response, 
        isUser: false 
      };
      setMessages((prev) => [...prev, botMessage]);
      
      // Speak the response if TTS is enabled
      if (speechSupported.synthesis) {
        speak(data.response);
      }
    } catch (error) {
      console.error("Error communicating with chatbot API:", error);
      setMessages((prev) => [...prev, { 
        text: `Sorry, I'm having trouble connecting. Please try again. (Error: ${error.message})`, 
        isUser: false 
      }]);
    }
  };

  const toggleListening = () => {
    if (!speechSupported.recognition) {
      setMessages((prev) => [
        ...prev,
        { text: "Your browser doesn't support speech recognition.", isUser: false },
      ])
      return
    }

    isListening ? stopListening() : startListening()
  }

  const startListening = () => {
    setIsListening(true)
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      handleSendMessage(transcript)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      setMessages((prev) => [
        ...prev,
        { text: `Error: ${event.error}`, isUser: false },
      ])
      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  return (
    <>
      {/* Floating chat button */}
      <motion.button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setActiveModal(isOpen ? null : 'chatbot')}
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 w-[350px] sm:w-[400px] h-[500px] bg-card rounded-xl shadow-xl border overflow-hidden z-50 flex flex-col"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
              <h3 className="font-medium">AI Insurance Assistant</h3>
              <div className="flex items-center gap-2">
                {speechSupported.synthesis && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={isSpeaking ? stopSpeaking : () => speak(messages[messages.length - 1].text)}
                    className="text-primary-foreground hover:bg-primary/90"
                  >
                    {isSpeaking ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveModal(null)}
                  className="text-primary-foreground hover:bg-primary/90"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`