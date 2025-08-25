"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Image,
  FileVideo,
  FileAudio,
  Archive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  required?: boolean;
  currentFile?: string;
  onUpload: (url: string) => void;
  onError?: (error: string) => void;
  className?: string;
  bucketName?: string;
  filePath?: string;
  disabled?: boolean;
  multiple?: boolean;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
  url?: string;
}

const FILE_TYPE_ICONS = {
  'image': Image,
  'video': FileVideo,
  'audio': FileAudio,
  'application/pdf': FileText,
  'application/zip': Archive,
  'application/x-zip-compressed': Archive,
  'application/x-rar-compressed': Archive,
  'default': File
};

const FILE_TYPE_GROUPS = {
  'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  'video': ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  'audio': ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
  'document': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'archive': ['application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed']
};

export function FileUpload({
  label,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 10,
  required = false,
  currentFile,
  onUpload,
  onError,
  className,
  bucketName = "documents",
  filePath,
  disabled = false,
  multiple = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const getFileIcon = useCallback((fileType: string) => {
    // Check specific file types first
    if (FILE_TYPE_ICONS[fileType as keyof typeof FILE_TYPE_ICONS]) {
      return FILE_TYPE_ICONS[fileType as keyof typeof FILE_TYPE_ICONS];
    }

    // Check file type groups
    for (const [group, types] of Object.entries(FILE_TYPE_GROUPS)) {
      if (types.includes(fileType)) {
        return FILE_TYPE_ICONS[group as keyof typeof FILE_TYPE_ICONS] || FILE_TYPE_ICONS.default;
      }
    }

    return FILE_TYPE_ICONS.default;
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    const allowedTypes = accept.split(",").map(type => type.trim().toLowerCase());
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const fileMimeType = file.type.toLowerCase();

    // Check both extension and MIME type
    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type;
      }
      return fileMimeType === type || fileMimeType.startsWith(type.replace('*', ''));
    });

    if (!isValidType) {
      return `File type not allowed. Accepted types: ${accept}`;
    }

    return null;
  }, [accept, maxSize]);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const supabase = createClient();

    if (!user) {
      const errorMsg = "User not authenticated";
      setError(errorMsg);
      onError?.(errorMsg);
      return null;
    }

    try {
      const fileExt = file.name.split(".").pop();
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      
      // Generate unique filename
      const fileName = filePath
        ? `${filePath}/${file.name.replace(/\.[^/.]+$/, "")}_${timestamp}_${randomId}.${fileExt}`
        : `${user.id}/${file.name.replace(/\.[^/.]+$/, "")}_${timestamp}_${randomId}.${fileExt}`;

      console.log("Uploading file:", {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        path: fileName,
        bucket: bucketName
      });

      // Upload file with progress tracking
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        
        let errorMessage = "Upload failed";
        if (error.message?.includes("row-level security policy") || error.message?.includes("RLS")) {
          errorMessage = "Storage permissions not configured. Please contact administrator.";
        } else if (error.message?.includes("bucket")) {
          errorMessage = "Storage bucket not found. Please contact administrator.";
        } else if (error.message?.includes("file")) {
          errorMessage = "File upload failed. Please try again.";
        } else {
          errorMessage = `Upload failed: ${error.message}`;
        }
        
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      }

      console.log("Upload successful:", data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log("Public URL:", publicUrl);
      return publicUrl;

    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg = "Failed to upload file. Please try again.";
      setError(errorMsg);
      onError?.(errorMsg);
      return null;
    }
  }, [user, bucketName, filePath, onError, formatFileSize]);

  const handleFileSelect = useCallback(async (files: FileList) => {
    setError(null);
    const fileArray = Array.from(files);

    if (!multiple && fileArray.length > 1) {
      const errorMsg = "Only one file can be uploaded at a time";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const uploadedUrls: string[] = [];
    const fileInfos: FileInfo[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        onError?.(validationError);
        setIsUploading(false);
        return;
      }

      // Simulate progress for this file
      const fileProgress = (i / fileArray.length) * 100;
      setUploadProgress(fileProgress);

      // Upload file
      const url = await uploadFile(file);
      if (url) {
        uploadedUrls.push(url);
        fileInfos.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url
        });
      } else {
        setIsUploading(false);
        return;
      }
    }

    setUploadProgress(100);
    setUploadedFiles(prev => [...prev, ...fileInfos]);

    // Call onUpload with the appropriate URL(s)
    if (multiple) {
      // For multiple files, we might want to handle this differently
      onUpload(uploadedUrls.join(','));
    } else {
      onUpload(uploadedUrls[0]);
    }

    setIsUploading(false);
  }, [multiple, validateFile, uploadFile, onUpload, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect, disabled]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const removeFile = useCallback((index?: number) => {
    if (index !== undefined) {
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setUploadedFiles([]);
    }
    onUpload("");
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* Show uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((fileInfo, index) => {
            const FileIcon = getFileIcon(fileInfo.type);
            return (
              <Card key={index} className="border-green-200 bg-green-50/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {fileInfo.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(fileInfo.size)}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Show current file if provided */}
      {currentFile && !uploadedFiles.length && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">File uploaded successfully</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {currentFile}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile()}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload area */}
      {(!currentFile || multiple) && (
        <Card
          className={cn(
            "border-2 border-dashed transition-all duration-200 cursor-pointer",
            isDragging && !disabled
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            error && "border-destructive bg-destructive/5",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <CardContent className="p-6 text-center">
            {isUploading ? (
              <div className="space-y-4">
                <Upload className="h-8 w-8 text-primary mx-auto animate-pulse" />
                <div>
                  <div className="font-medium">Uploading...</div>
                  <Progress value={uploadProgress} className="mt-2" />
                  <div className="text-sm text-muted-foreground mt-1">
                    {Math.round(uploadProgress)}% complete
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="space-y-3">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
                <div className="font-medium text-destructive">{error}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearError}
                  disabled={disabled}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <div>
                  <div className="font-medium">
                    {multiple ? "Drop files here or click to browse" : "Drop your file here or click to browse"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Accepted formats: {accept} (max {maxSize}MB)
                    {multiple && " - Multiple files allowed"}
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled={disabled}>
                  <File className="h-4 w-4 mr-2" />
                  Choose {multiple ? "Files" : "File"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
}
