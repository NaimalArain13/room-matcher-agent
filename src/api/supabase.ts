import { supabase } from "@/lib/supabase"

export async function uploadFileToSupabase(file: File, bucket = "uploads"): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`
  const path = `docs/${fileName}`

  // 1. Upload file
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file)

  if (uploadError) {
    console.error("Supabase upload error:", uploadError)
    throw uploadError
  }

  // 2. Construct URL in the specified format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const projectRef = supabaseUrl.split('//')[1].split('.')[0] // Extract project-ref from URL
  const fileUrl = `${supabaseUrl}/${path}`

  console.log("Supabase file URL:", fileUrl)

  return fileUrl
}
