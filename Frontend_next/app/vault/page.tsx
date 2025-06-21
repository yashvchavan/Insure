"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/FileUploader"
import { FileText, FolderOpen, Lock, Shield, AlertCircle, X, Loader2 } from "lucide-react"
import useAuth from "@/context/store"
import { uploadDocuments, fetchDocuments, deleteDocument } from "@/services/documentService"
import { UploadDocumentResponse, IDocument } from '@/types/document';
import router from "next/router"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function VaultPage() {
  const [pinVerified, setPinVerified] = useState(false)
  const [pin, setPin] = useState(["", "", "", ""])
  const [pinError, setPinError] = useState("")
  const [showForgotPin, setShowForgotPin] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { user } = useAuth() as { user: { username: string ,id:string} | null } || { user: null };
  const [userDocuments, setUserDocuments] = useState<IDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const [pinSetupComplete, setPinSetupComplete] = useState(false);
  const [password, setPassword] = useState(""); // For password verification
  const [isSettingPin, setIsSettingPin] = useState(false); // Controls PIN setup UI
  const [newPin, setNewPin] = useState(["", "", "", ""]); // For new PIN entry
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]); // For PIN confirmation

  useEffect(() => {
    if (!user) {
      router.push("/user-login");
    }
  }, [user]);


  useEffect(() => {
    if (pinVerified && user?.id) {
      const loadDocuments = async () => {
        setIsLoading(true);
        try {
          const docs = await fetchDocuments(user.id);
          setUserDocuments(docs);
        } catch (error) {
          console.error('Failed to load documents:', error);
          toast.error('Failed to load documents');
        } finally {
          setIsLoading(false);
        }
      };
      loadDocuments();
    }
  }, [pinVerified, user?.id]);

  useEffect(() => {
    console.log("Documents updated", userDocuments);
  }, [userDocuments]); // This will log whenever userDocuments changes

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (value && !isNaN(Number(value))) {
      const newPin = [...pin]
      newPin[index] = value
      setPin(newPin)

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`)
        if (nextInput) {
          nextInput.focus()
        }
      }
    } else if (value === "") {
      const newPin = [...pin]
      newPin[index] = ""
      setPin(newPin)
    }
  }

  const handleUpload = async () => {
    if (files.length === 0 || !user?.id) return;
    
    setIsUploading(true);
    try {
      const result = await uploadDocuments(files, user.id);
      // Refresh documents after successful upload
      const updatedDocs = await fetchDocuments(user.id);
      setUserDocuments(updatedDocs);
      
      toast.success(`${result.documents.length} file(s) uploaded successfully`);
      
      setFiles([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload documents");
    } finally {
      setIsUploading(false);
    }
  };

  // Add to VaultPage.tsx
  const handleDelete = async (documentId: string) => {
    if (!user?.id) return;
    
    try {
      await deleteDocument(documentId, user.id);
      const updatedDocs = await fetchDocuments(user.id);
      setUserDocuments(updatedDocs);
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete document");
    }
  };


  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  

  const resetPin = () => {
    setPinVerified(false)
    setPin(["", "", "", ""])
    setPinError("")
    setShowForgotPin(false)
  }

  const fetchUserPin = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/pin?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success && data.pin) {
        setPinSetupComplete(true);
      }
    } catch (error) {
      console.error('Error fetching PIN:', error);
    }
  };
  
  useEffect(() => {
    fetchUserPin();
  }, [user?.id]);
  
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
  
  const savePin = async () => {
    const enteredPin = newPin.join("");
    const enteredConfirmPin = confirmPin.join("");
    
    if (enteredPin.length !== 4 || enteredConfirmPin.length !== 4) {
      setPinError("Please complete both PIN fields");
      return;
    }
    
    if (enteredPin !== enteredConfirmPin) {
      setPinError("PINs don't match");
      return;
    }
    
    try {
      const response = await fetch('/api/pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          pin: enteredPin
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPinSetupComplete(true);
        setIsSettingPin(false);
        setPinError("");
      } else {
        setPinError("Failed to save PIN. Please try again.");
      }
    } catch (error) {
      console.error('Error saving PIN:', error);
      setPinError("Failed to save PIN. Please try again.");
    }
  };
  
  // Update verifyPin to check against the stored PIN
  const verifyPin = async () => {
    const enteredPin = pin.join("");
    
    try {
      const response = await fetch(`/api/pin?userId=${user?.id}`);
      const data = await response.json();
      
      if (data.success && data.pin === enteredPin) {
        setPinVerified(true);
        setPinError("");
      } else {
        setPinError("Incorrect PIN. Please try again.");
        setPin(["", "", "", ""]);
        document.getElementById("pin-0")?.focus();
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      setPinError("Failed to verify PIN. Please try again.");
    }
  };

  const verifyPasswordForPinReset = async () => {
    if (!user?.id || !password) return;
  
    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowForgotPin(false);
        setIsSettingPin(true);
        setPinSetupComplete(false);
        setPassword("");
      } else {
        setPinError(data.error || "Incorrect password");
        setPassword("");
      }
    } catch (error) {
      setPinError("Failed to verify password. Please try again.");
      console.error('Error verifying password:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-8 text-primary">Secure Document Vault</h1>

        {!pinVerified ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {pinSetupComplete ? "Enter Your PIN" : "Set Up Your Vault PIN"}
              </CardTitle>
              <CardDescription>
                {pinSetupComplete 
                  ? "Enter your 4-digit PIN to access your document vault"
                  : "Create a secure 4-digit PIN to protect your documents"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showForgotPin ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <h3 className="font-medium mb-2">Reset Your PIN</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      For security, please enter your account password to reset your vault PIN.
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Input 
                          type="password" 
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="w-full"
                          onClick={verifyPasswordForPinReset}
                          disabled={!password}
                        >
                          Verify Password
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowForgotPin(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isSettingPin || !pinSetupComplete ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Create New PIN</label>
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
                            onKeyDown={(e) => handleKeyDown(index, e)}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Confirm PIN</label>
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
                            onKeyDown={(e) => handleKeyDown(index, e)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {pinError && (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {pinError}
                    </div>
                  )}

                  <Button 
                    onClick={savePin}
                    disabled={newPin.some(d => d === "") || confirmPin.some(d => d === "")}
                  >
                    Save PIN
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <Input
                        key={index}
                        id={`pin-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        className="w-12 h-12 text-center text-xl"
                        value={pin[index]}
                        onChange={(e) => handlePinChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                      />
                    ))}
                  </div>

                  {pinError && (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {pinError}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <Button onClick={verifyPin} disabled={pin.some((digit) => digit === "")}>
                      Access Vault
                    </Button>
                    <Button variant="link" className="text-sm" onClick={() => setShowForgotPin(true)}>
                      Forgot PIN?
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Shield className="h-5 w-5 text-primary" />
                    <p className="text-xs text-muted-foreground">
                      Your documents are encrypted and securely stored. Only you can access them with your PIN.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Documents</h2>
              <Button variant="outline" onClick={resetPin}>
                <Lock className="h-4 w-4 mr-2" />
                Lock Vault
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="upload">Upload New</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>All Documents</CardTitle>
                    <CardDescription>View and manage all your securely stored documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : userDocuments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No documents found
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userDocuments.map((doc) => (
                          <div key={doc?.id?.toString()} className="flex items-center p-3 rounded-lg border">
                            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{doc.name}</h4>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                                <span className="mx-2">•</span>
                                <span>{doc.format}</span>
                                <span className="mx-2">•</span>
                                <span>
                                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(doc.url, '_blank')}
                              >
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = doc.url;
                                  link.download = doc.name;
                                  link.click();
                                }}
                              >
                                Download
                              </Button>
                              <Button 
                                variant="destructive"
                                disabled={isUploading} 
                                size="sm"
                                onClick={() => handleDelete(doc?.id?.toString())}
                                className="text-red-500 hover:bg-red-500 hover:text-white"  
                                
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              
              <TabsContent value="upload">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload New Documents</CardTitle>
                    <CardDescription>Add new documents to your secure vault</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 mb-4">
                          <FolderOpen className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">Upload Documents</h3>
                        </div>

                        <FileUploader
                          onFilesSelected={(newFiles) => setFiles([...files, ...newFiles])}
                          maxFiles={10}
                          acceptedFileTypes={[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]}
                          maxFileSizeMB={20}
                        />
                      </div>

                      {files.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-medium">Files to Upload</h3>
                          <div className="space-y-2">
                            {files.map((file, index) => (
                              <div key={index} className="flex items-center p-2 rounded bg-muted/30">
                                <FileText className="h-4 w-4 mr-2" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm truncate">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2"
                                  onClick={() => {
                                    const newFiles = [...files]
                                    newFiles.splice(index, 1)
                                    setFiles(newFiles)
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              onClick={handleUpload}
                              disabled={isUploading}
                            >
                              {isUploading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                "Upload All Files"
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setFiles([])}
                              disabled={isUploading}
                            >
                              Clear All
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <Shield className="h-5 w-5 text-primary" />
                        <p className="text-xs text-muted-foreground">
                          All uploaded documents are encrypted and securely stored. Only you can access them with your PIN.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </motion.div>
    </div>
  )
}

