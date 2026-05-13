"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import { Upload, Loader2, FileText, ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";

interface PdfUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export function PdfUpload({ onUpload, isUploading = false }: PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a PDF file");
    }
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Please upload a PDF file");
      }
    },
    [],
  );

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-background p-6 sm:p-10">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
            <BrandLogo variant="mark" className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Chat with your PDF
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a document and ask questions powered by AI
            </p>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={cn(
            "relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-150 overflow-hidden",
            isDragging
              ? "border-foreground/40 bg-muted/60"
              : "border-border hover:border-foreground/20 hover:bg-muted/30",
            isUploading && "pointer-events-none opacity-50",
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

          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-border bg-background">
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {isUploading
                  ? "Uploading and processing…"
                  : "Drop your PDF here"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {isUploading
                  ? "This may take a few moments"
                  : "or click to browse — PDF up to 10 MB"}
              </p>
            </div>
          </div>
        </div>

        {/* Selected file */}
        {selectedFile && (
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5 animate-fade-in">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              size="sm"
              className="shrink-0 rounded-lg bg-foreground text-background hover:bg-foreground/85 text-xs px-4"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                  Uploading
                </>
              ) : (
                <>
                  Start Chat
                  <ArrowRight className="ml-1.5 h-3 w-3" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
