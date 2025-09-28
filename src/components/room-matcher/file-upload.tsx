"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { runPipeline } from "@/api/run_pipeline"
// import { supabase } from "@/lib/supabase" // Commented out for now

interface FileUploadProps {
  onComplete: () => void
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
  // removed simulated progress; handle upload directly on change

  const onPick = () => {
    if (disabled || uploading) return
    inputRef.current?.click()
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isAllowedByExt = (name: string) => /\.(docx|pdf|png|jpg|jpeg)$/i.test(name)

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.files", e.target.files)
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
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
      // TODO: Supabase integration commented out for now
      // 1. Upload to Supabase bucket
      // const fileName = `${Date.now()}-${file.name}`
      // const { data, error } = await supabase.storage
      //   .from("uploads") // bucket name
      //   .upload(`docs/${fileName}`, file)

      // if (error) throw error

      // 2. Construct URL in the specified format
      // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      // const projectRef = supabaseUrl.split('//')[1].split('.')[0] // Extract project-ref from URL
      // const fileUrl = `https://${projectRef}.supabase.co/storage/v1/object/public/uploads/docs/${fileName}`

      // console.log("Got file URL:", fileUrl)

      toast({ title: "✅ File selected", description: file.name })

      // 3. Send file URL to backend API (runPipeline) - DISABLED
      // await runPipeline(fileUrl)
      // toast({ title: "Pipeline started" })

      // 4. Record file in list
      setUploadedFiles((prevArr) => [
        { name: file.name, sizeStr: formatBytes(file.size), uploadedAt: new Date().toLocaleString() },
        ...prevArr,
      ])

      // 5. Notify parent
      onComplete()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process file"
      toast({ title: "File processing failed", description: message })
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

        <Button
          type="button"
          onClick={onPick}
          disabled={disabled || uploading}
          aria-haspopup="true"
        >
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
              <span className="ml-3 inline-block rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-semibold">Ready</span>
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
                  <div className="text-xs text-muted-foreground">{f.sizeStr} · {f.uploadedAt}</div>
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
