"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react"

interface ImageUploaderProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
}

interface UploadProgress {
  [fileName: string]: number
}

export function ImageUploader({ value = [], onChange, maxFiles = 5 }: ImageUploaderProps) {
  const supabase = createClient()
  const [isDragging, setIsDragging] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [progress, setProgress] = React.useState<UploadProgress>({})
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const validateFile = (file: File): string | null => {
    // 1. Max size: 5MB
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return `${file.name} exceeds 5MB limit.`
    }
    // 2. Type check
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      return `${file.name} has unsupported file type. Use JPEG, PNG, or WEBP.`
    }
    return null
  }

  const uploadFiles = async (files: FileList | File[]) => {
    setError(null)
    const fileList = Array.from(files)

    // Check file count limits
    if (value.length + fileList.length > maxFiles) {
      setError(`Maximum of ${maxFiles} images allowed.`)
      return
    }

    // Validate files
    for (const file of fileList) {
      const fileError = validateFile(file)
      if (fileError) {
        setError(fileError)
        return
      }
    }

    setUploading(true)
    const newUrls: string[] = []

    try {
      // Get current user to construct isolated paths
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("User session not found. Please log in.")
        setUploading(false)
        return
      }

      for (const file of fileList) {
        const cleanedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        const filePath = `${user.id}/${Date.now()}-${cleanedName}`

        // Initialize progress for this file
        setProgress((prev) => ({ ...prev, [file.name]: 10 }))

        // Perform Supabase Storage Upload
        const { data, error: uploadError } = await supabase.storage
          .from("properties")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          throw uploadError
        }

        setProgress((prev) => ({ ...prev, [file.name]: 100 }))

        // Retrieve public URL
        const { data: { publicUrl } } = supabase.storage
          .from("properties")
          .getPublicUrl(filePath)

        newUrls.push(publicUrl)
      }

      onChange([...value, ...newUrls])
    } catch (err: any) {
      console.error("Storage upload failed:", err)
      setError(err.message || "An error occurred during file upload.")
    } finally {
      setUploading(false)
      setProgress({})
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files)
    }
  }

  const handleRemove = async (urlToRemove: string) => {
    setError(null)
    
    try {
      // Extract file path from public URL
      // E.g., https://.../storage/v1/object/public/properties/user_id/123-filename.jpg
      const urlParts = urlToRemove.split("/properties/")
      if (urlParts.length < 2) {
        // Fallback: just remove from state
        onChange(value.filter((url) => url !== urlToRemove))
        return
      }

      const filePath = decodeURIComponent(urlParts[1])
      
      // Delete file from Supabase Storage
      const { error: deleteError } = await supabase.storage
        .from("properties")
        .remove([filePath])

      if (deleteError) {
        console.warn("Storage deletion warning:", deleteError)
      }

      onChange(value.filter((url) => url !== urlToRemove))
    } catch (err: any) {
      console.error("Delete failed:", err)
      // Remove from list anyway
      onChange(value.filter((url) => url !== urlToRemove))
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative border border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition select-none ${
          isDragging
            ? "border-sky-500 bg-sky-500/5 text-sky-400"
            : "border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-400"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/jpg"
        />

        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
            <span>Uploading visual assets to vault...</span>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-sky-400" />
            <div className="space-y-1">
              <span className="font-bold text-slate-200 block">Drag & Drop Property Images</span>
              <span className="text-slate-500 font-sans block">or click to browse local files (max {maxFiles} images)</span>
              <span className="text-slate-600 font-sans text-[10px] block">JPEG, PNG, WEBP up to 5MB each</span>
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Progress Bars */}
      {Object.entries(progress).map(([name, val]) => (
        <div key={name} className="space-y-1 bg-slate-900/40 p-2.5 rounded-lg border border-slate-850">
          <div className="flex justify-between text-[10px] text-slate-400 truncate">
            <span className="truncate">{name}</span>
            <span>{val}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
            <div className="bg-sky-500 h-full transition-all duration-300" style={{ width: `${val}%` }} />
          </div>
        </div>
      ))}

      {/* Image Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-xl overflow-hidden border border-slate-800 group bg-slate-950"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Preview ${index + 1}`} className="object-cover w-full h-full" />
              
              {/* Badges */}
              {index === 0 && (
                <span className="absolute top-1.5 left-1.5 z-10 text-[8px] font-bold bg-sky-500 text-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                  Primary
                </span>
              )}

              {/* Delete overlay */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(url)
                }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200"
              >
                <X className="h-5 w-5 text-rose-400 hover:scale-110 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
