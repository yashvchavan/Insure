"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Lock, AlertCircle, Trash2 } from "lucide-react";

export default function VaultPage() {
  const [pinVerified, setPinVerified] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const API_BASE_URL = "http://localhost:4000/api/v1/users/document";

  // Fetch documents from backend
  const fetchDocuments = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all-documents`, {
            withCredentials: true, // Ensures cookies are sent
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Ensure this matches your login flow
            },
        });
        setDocuments(response.data.data);
    } catch (error) {
        console.error("Failed to fetch documents:", error);
    }
};


  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle file upload
  const handleFileUpload = async () => {
    if (!uploadFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("fileName", uploadFile.name);
    formData.append("document", uploadFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload-document`, formData, {
        withCredentials: true, // ✅ Ensures cookies are sent
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log
      if (response.data.success) {
        alert("File uploaded successfully!");
        fetchDocuments(); // Refresh document list
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed.");
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/delete-document/${documentId}`, {
        withCredentials: true, // ✅ Ensures cookies are sent
      });

      if (response.data.success) {
        alert("Document deleted successfully!");
        fetchDocuments(); // Refresh document list
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Document deletion failed.");
    }
  };

  // Handle PIN input
  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    if (value && !isNaN(Number(value))) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
      }
    } else if (value === "") {
      const newPin = [...pin];
      newPin[index] = "";
      setPin(newPin);
    }
  };

  // PIN verification
  const verifyPin = () => {
    const enteredPin = pin.join("");
    if (enteredPin === "1234") {
      setPinVerified(true);
      setPinError("");
    } else {
      setPinError("Incorrect PIN. Please try again.");
      setPin(["", "", "", ""]);
      document.getElementById("pin-0")?.focus();
    }
  };

  // Reset PIN and logout
  const resetPin = () => {
    setPinVerified(false);
    setPin(["", "", "", ""]);
    setPinError("");
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
                Secure Access
              </CardTitle>
              <CardDescription>Enter your 4-digit PIN to access your document vault</CardDescription>
            </CardHeader>
            <CardContent>
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
                    />
                  ))}
                </div>

                {pinError && (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {pinError}
                  </div>
                )}

                <Button onClick={verifyPin} disabled={pin.some((digit) => digit === "")}>
                  Access Vault
                </Button>
              </div>
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
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div key={doc._id} className="flex items-center justify-between p-3 border">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        <span>{doc.fileName}</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteDocument(doc._id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>No documents available.</p>
                )}
              </TabsContent>

              <TabsContent value="upload">
                <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                <Button onClick={handleFileUpload} disabled={!uploadFile}>
                  Upload File
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </motion.div>
    </div>
  );
}