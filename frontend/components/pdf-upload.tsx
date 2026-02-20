'use client'

import React from "react"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { FileText, Upload, Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'

interface PdfUploadProps {
  onUpload: (file: File) => void
  isUploading?: boolean
}

export function PdfUpload({ onUpload, isUploading = false }: PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && file.type === 'application/pdf') {
        setSelectedFile(file)
      } else {
        alert('Please upload a PDF file')
      }
    },
    []
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && file.type === 'application/pdf') {
        setSelectedFile(file)
      } else {
        alert('Please upload a PDF file')
      }
    },
    []
  )

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile)
      setSelectedFile(null)
    }
  }

  return (
    <div className="flex h-full items-center justify-center p-8">
      <Card className="w-full max-w-2xl p-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-balance text-foreground">
              Chat with Your PDF
            </h1>
            <p className="mt-2 text-muted-foreground text-pretty">
              Upload a PDF document and ask questions powered by AI
            </p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            className={cn(
              'relative rounded-lg border-2 border-dashed p-12 text-center transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent/50',
              isUploading && 'pointer-events-none opacity-50'
            )}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="absolute inset-0 cursor-pointer opacity-0"
              id="pdf-upload"
              disabled={isUploading}
            />
            {isUploading ? (
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            ) : (
              <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            )}
            <p className="mt-4 text-sm font-medium text-foreground">
              {isUploading ? 'Uploading and processing your PDF...' : 'Drop your PDF here or click to browse'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isUploading ? 'This may take a few moments' : 'Supports PDF files up to 10MB'}
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Start Chat'
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
