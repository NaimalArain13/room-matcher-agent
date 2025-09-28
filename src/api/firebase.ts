import { getFirebaseStorage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export async function uploadFileToFirebase(file: File): Promise<string> {
  const storage = getFirebaseStorage()
  const timestamp = Date.now()
  const path = `uploads/${new Date(timestamp).toISOString().slice(0, 10)}/${timestamp}-${file.name.replace(/\s+/g, "_")}`
  const storageRef = ref(storage, path)
  const snapshot = await uploadBytes(storageRef, file, { contentType: file.type || "application/octet-stream" })
  return await getDownloadURL(snapshot.ref)
}


