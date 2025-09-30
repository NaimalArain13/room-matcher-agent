"use client"

import type React from "react"
import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { runPipeline } from "@/api/run_pipeline"
import { getFirebase } from "@/lib/firebase"
import { ref, set } from "firebase/database"
import { File, Upload, CheckCircle, FileText, Image, FileLock } from "lucide-react"
import type { ParsedProfile } from "@/types/matching"
import { FlowTracer } from "@/types/trace"

interface FileUploadProps {
  onComplete: (profile?: ParsedProfile) => void
  disabled?: boolean
}

type UploadedFile = {
  name: string
  sizeStr: string
  uploadedAt: string
}

export function FileUpload({ onComplete, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const fileRef = useRef<File | null>(null)
  const { toast } = useToast()
  const [uploading, setUploading] = useState<boolean>(false)
  const [currentFileName, setCurrentFileName] = useState<string | null>(null)
  const [currentFileSizeStr, setCurrentFileSizeStr] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onPick = () => {
    if (disabled || uploading) return
    inputRef.current?.click()
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isAllowedByExt = (name: string) => /\.(docx|pdf|png|jpg|jpeg)$/i.test(name)

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
      )
    }
    const form = new FormData()
    form.append("file", file)
    form.append("upload_preset", uploadPreset)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: form,
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json?.error?.message || "Cloudinary upload failed")
    }
    return json.secure_url as string
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return <FileLock className="w-4 h-4 text-red-500 dark:text-red-400" />
    if (['png', 'jpg', 'jpeg'].includes(ext || '')) return <Image className="w-4 h-4 text-blue-500 dark:text-blue-400" />
    return <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
  }

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    // Clear previous trace and start new one
    FlowTracer.clear()
    FlowTracer.log('File Upload', 'start', { 
      fileName: file.name, 
      fileSize: formatBytes(file.size),
      fileType: file.type 
    })

    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "image/png",
      "image/jpeg",
    ]

    const mimeOk = allowedMimes.includes(file.type)
    const extOk = isAllowedByExt(file.name)

    if (!mimeOk && !extOk) {
      FlowTracer.log('File Validation', 'error', { 
        reason: 'Invalid file format',
        fileType: file.type 
      })
      toast({
        title: "Invalid file format",
        description: "Allowed: .docx, .pdf, .png, .jpg",
      })
      if (inputRef.current) inputRef.current.value = ""
      return
    }

    FlowTracer.log('File Validation', 'success', { fileType: file.type })

    setCurrentFileName(file.name)
    setCurrentFileSizeStr(formatBytes(file.size))
    setUploading(true)
    fileRef.current = file

    try {
      // 1) Upload to Cloudinary
      FlowTracer.log('Cloudinary Upload', 'start')
      const fileUrl = await uploadToCloudinary(file)
      FlowTracer.log('Cloudinary Upload', 'success', { url: fileUrl })

      // 2) Save to Firebase
      FlowTracer.log('Firebase Save', 'start')
      const { db } = getFirebase()
      const id = typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}`
      const uploadedAtIso = new Date().toISOString()
      await set(ref(db, `uploads/${id}`), {
        name: file.name,
        size: file.size,
        sizeStr: formatBytes(file.size),
        url: fileUrl,
        uploadedAt: uploadedAtIso,
      })
      FlowTracer.log('Firebase Save', 'success', { uploadId: id })

      // 3) Run pipeline to parse
      FlowTracer.log('Backend Parsing', 'start')
      const pipelineResult = await runPipeline(file)

      const parsedProfile: ParsedProfile | undefined =
        pipelineResult?.parsed_profile ??
        pipelineResult?.result?.parsed_profile ??
        pipelineResult?.result?.profile ??
        pipelineResult?.profile

      if (!parsedProfile) {
        FlowTracer.log('Backend Parsing', 'error', { 
          reason: 'No parsed profile in response',
          response: pipelineResult 
        })
        throw new Error("Backend did not return a parsed profile")
      }

      FlowTracer.log('Backend Parsing', 'success', { 
        profileId: parsedProfile.id,
        city: parsedProfile.city,
        budget: parsedProfile.budget_PKR 
      })

      // 4) Update uploaded files list
      setUploadedFiles((prevArr) => [
        { name: file.name, sizeStr: formatBytes(file.size), uploadedAt: new Date().toLocaleString() },
        ...prevArr,
      ])

      // 5) Call onComplete
      FlowTracer.log('Profile Ready', 'success')
      onComplete(parsedProfile)

      // 6) Toast success
      toast({
        title: "Uploaded",
        description: "File uploaded and parsed successfully.",
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process file"
      FlowTracer.log('File Upload', 'error', { error: message })
      toast({
        title: "File processing failed",
        description: message,
      })
    } finally {
      setUploading(false)
      fileRef.current = null
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
    >
      <div className="space-y-6">
        <Label
          htmlFor="file"
          className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2"
        >
          <Upload className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          Upload Completed Template
        </Label>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            id="file"
            ref={inputRef}
            type="file"
            accept=".docx,application/pdf,image/png,image/jpeg,.png,.jpg"
            className="hidden"
            onChange={onChange}
            aria-label="Upload file"
          />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              onClick={onPick}
              disabled={disabled || uploading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 disabled:opacity-50"
              aria-haspopup="true"
            >
              {uploading ? (
                <span className="inline-flex items-center gap-2">
                  <motion.svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </motion.svg>
                  Uploading…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Choose File
                </span>
              )}
            </Button>
          </motion.div>

          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload completed template (.docx, .pdf, .png, .jpg). No size limit.
            </p>

            <AnimatePresence>
              {currentFileName && !uploading && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-2"
                >
                  {getFileIcon(currentFileName)}
                  <span className="font-medium">{currentFileName}</span>
                  {currentFileSizeStr && (
                    <span className="text-gray-500 dark:text-gray-400">· {currentFileSizeStr}</span>
                  )}
                  <span className="ml-2 inline-block rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-0.5 text-xs font-semibold">
                    Ready
                  </span>
                </motion.p>
              )}

              {uploading && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  Uploading: <span className="font-medium">{currentFileName ?? "Preparing…"}</span>
                  {currentFileSizeStr && (
                    <span className="text-gray-500 dark:text-gray-400">· {currentFileSizeStr}</span>
                  )}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="mt-6"
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <File className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Uploaded Files
            </h4>
            <ul className="mt-2 space-y-2">
              {uploadedFiles.map((f, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                  className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    {getFileIcon(f.name)}
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{f.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {f.sizeStr} · {f.uploadedAt}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Uploaded
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
