"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { runPipeline } from "@/api/run_pipeline"
import { uploadFileToFirebase } from "@/api/firebase"

interface FileUploadProps {
  onComplete: () => void
  disabled?: boolean
}

export function FileUpload({ onComplete, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const fileRef = useRef<File | null>(null)
  const { toast } = useToast()
  const [progress, setProgress] = useState<number>(0)
  const [uploading, setUploading] = useState<boolean>(false)

  useEffect(() => {
    let timer: number | undefined
    if (uploading) {
      setProgress(0)
      // animate 0 -> 100
      timer = window.setInterval(() => {
        setProgress((p) => {
          const next = p + Math.random() * 18
          if (next >= 100) {
            window.clearInterval(timer)
            window.setTimeout(() => {
              setUploading(false)
              toast({
                title: "File uploaded — parsing now…",
              })
              // Upload to Firebase first, then pass URL to pipeline
              if (fileRef.current) {
                const file = fileRef.current
                uploadFileToFirebase(file)
                  .then((publicUrl) => runPipeline(publicUrl))
                  .then(() => {
                    toast({ title: "Pipeline started" })
                  })
                  .catch((err: unknown) => {
                    const message = err instanceof Error ? err.message : "Failed to upload to Firebase or start pipeline"
                    toast({ title: "Upload failed", description: message })
                  })
                  .finally(() => {
                    fileRef.current = null
                  })
              }
              onComplete()
            }, 300)
            return 100
          }
          return next
        })
      }, 200)
    }
    return () => {
      if (timer) window.clearInterval(timer)
    }
  }, [uploading, onComplete, toast])

  const onPick = () => {
    inputRef.current?.click()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.files", e.target.files)
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    fileRef.current = file
    setUploading(true)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="file">Upload completed template</Label>
      <div className="flex items-center gap-3">
        <input
          id="file"
          ref={inputRef}
          type="file"
          accept=".docx,application/pdf,image/png,image/jpeg,.png,.jpg"
          className="hidden"
          onChange={onChange}
        />
        <Button type="button" onClick={onPick} disabled={disabled || uploading} aria-haspopup="true">
          {uploading ? "Uploading…" : "Choose file"}
        </Button>
        <span className="text-sm text-muted-foreground">
          Upload completed template (.docx, .pdf, images). We’ll parse and suggest matches.
        </span>
      </div>

      {uploading ? (
        <div className="pt-2">
          <Progress value={progress} aria-label="Upload progress" />
        </div>
      ) : null}
    </div>
  )
}
