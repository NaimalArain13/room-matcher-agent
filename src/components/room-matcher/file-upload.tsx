"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { runPipeline } from "@/api/run_pipeline"
import { getFirebase } from "@/lib/firebase"
import { ref, set } from "firebase/database"
import type { ParsedProfile } from "@/types/matching"

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

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(" onChange -> files:", e.target.files) // debug
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "image/png",
      "image/jpeg",
    ]

    const mimeOk = allowedMimes.includes(file.type)
    const extOk = isAllowedByExt(file.name)

    if (!mimeOk && !extOk) {
      toast({
        title: "❌ Invalid file format",
        description: "Allowed: .docx, .pdf, .png, .jpg",
      })
      if (inputRef.current) inputRef.current.value = ""
      return
    }

    setCurrentFileName(file.name)
    setCurrentFileSizeStr(formatBytes(file.size))
    setUploading(true)
    fileRef.current = file

    try {
      // 1) Upload to Cloudinary to obtain a public URL (for storage/sharing)
      const fileUrl = await uploadToCloudinary(file)

      // 2) Save file metadata + URL to Firebase Realtime Database
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


      console.log("[v0] Calling runPipeline with File object") 
      const pipelineResult = await runPipeline(file)

      const parsedProfile: ParsedProfile | undefined =
        pipelineResult?.parsed_profile ??
        pipelineResult?.result?.parsed_profile ??
        pipelineResult?.result?.profile ??
        pipelineResult?.profile

      if (!parsedProfile) {
        console.log("pipelineResult (no parsed_profile found):", pipelineResult) // debug
        throw new Error("Backend did not return a parsed profile")
      }

      setUploadedFiles((prevArr) => [
        { name: file.name, sizeStr: formatBytes(file.size), uploadedAt: new Date().toLocaleString() },
        ...prevArr,
      ])

      onComplete(parsedProfile)

      // 6) Toast success
      toast({ title: "✅ Uploaded", description: "File uploaded and parsed successfully." })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process file"
      console.log("File processing error:", err) 
      toast({ title: "❌ File processing failed", description: message })
    } finally {
      setUploading(false)
      fileRef.current = null
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="file">Upload completed template</Label>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          id="file"
          ref={inputRef}
          type="file"
          accept=".docx,application/pdf,image/png,image/jpeg,.png,.jpg"
          className="hidden"
          onChange={onChange}
        />

        <Button type="button" onClick={onPick} disabled={disabled || uploading} aria-haspopup="true">
          {uploading ? (
            <span className="inline-flex items-center gap-2">
              {/* small inline loader */}
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Uploading…
            </span>
          ) : (
            "Choose file"
          )}
        </Button>

        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            Upload completed template (.docx, .pdf, .png, .jpg). No size limit.
          </p>

          {currentFileName && !uploading && (
            <p className="text-sm text-green-600 mt-1">
              📄 <span className="font-medium">{currentFileName}</span>
              {currentFileSizeStr ? <span className="ml-2 text-muted-foreground">· {currentFileSizeStr}</span> : null}
              <span className="ml-3 inline-block rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-semibold">
                Ready
              </span>
            </p>
          )}

          {uploading && (
            <p className="text-sm text-muted-foreground mt-1">
              📤 Uploading: <span className="font-medium">{currentFileName ?? "Preparing…"}</span>
              {currentFileSizeStr ? <span className="ml-2 text-muted-foreground">· {currentFileSizeStr}</span> : null}
            </p>
          )}
        </div>
      </div>

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-semibold">Uploaded files</h4>
          <ul className="mt-2 space-y-1">
            {uploadedFiles.map((f, idx) => (
              <li key={idx} className="flex items-center justify-between bg-surface-50 p-2 rounded">
                <div>
                  <div className="text-sm font-medium">{f.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {f.sizeStr} · {f.uploadedAt}
                  </div>
                </div>
                <div className="text-xs text-green-600 font-semibold">Uploaded</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}