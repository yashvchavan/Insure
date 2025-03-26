"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  acceptedFileTypes?: string[]
  maxFileSizeMB?: number
}

export function FileUploader({
  onFilesSelected,
  maxFiles = 5,
  acceptedFileTypes = [".pdf", ".jpg", ".jpeg", ".png"],
  maxFileSizeMB = 10,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const validateFiles = (files: File[]): File[] => {
    setError(null)

    // Check file count
    if (files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once.`)
      return []
    }

    // Check file types and sizes
    const validFiles = Array.from(files).filter((file) => {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`

      if (!acceptedFileTypes.includes(fileExtension)) {
        setError(`Only ${acceptedFileTypes.join(", ")} files are accepted.`)
        return false
      }

      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`Files must be smaller than ${maxFileSizeMB}MB.`)
        return false
      }

      return true
    })

    return validFiles
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = validateFiles(droppedFiles)

    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = validateFiles(selectedFiles)

      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
      }

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="w-full">
      <motion.div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        animate={{ borderColor: isDragging ? "var(--primary)" : "var(--muted-foreground-20)" }}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports {acceptedFileTypes.join(", ")} (Max: {maxFileSizeMB}MB)
            </p>
          </div>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-2">
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFileTypes.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </motion.div>

      {error && (
        <div className="mt-2 text-sm text-red-500 flex items-center">
          <X className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}

