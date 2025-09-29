export const runPipeline = async (fileOrPath: File | string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_SERVER
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_SERVER is not configured")
  }

  let res: Response
  if (typeof fileOrPath === "string") {
    const isHttp = /^https?:\/\//i.test(fileOrPath)
    if (isHttp) {
      try {
        const fetched = await fetch(fileOrPath)
        if (!fetched.ok) throw new Error(`Failed to fetch URL: ${fetched.status} ${fetched.statusText}`)
        const blob = await fetched.blob()
        const filename = fileOrPath.split("/").pop()?.split("?")[0] || "upload.bin"
        const file = new File([blob], filename, {
          type: blob.type || "application/octet-stream",
        })
        const form = new FormData()
        form.append("file", file)
        res = await fetch(`${baseUrl}/api/run-pipeline`, {
          method: "POST",
          body: form,
        })
      } catch (e) {
        // Fallback to sending file_path as form (backend may still reject remote paths)
        const form = new FormData()
        form.append("file_path", fileOrPath)
        res = await fetch(`${baseUrl}/api/run-pipeline`, {
          method: "POST",
          body: form,
        })
      }
    } else {
      const form = new FormData()
      form.append("file_path", fileOrPath)
      res = await fetch(`${baseUrl}/api/run-pipeline`, {
        method: "POST",
        body: form,
      })
    }
  } else {
    // Prefer sending the actual file via multipart/form-data
    const form = new FormData()
    form.append("file", fileOrPath)
    res = await fetch(`${baseUrl}/api/run-pipeline`, {
      method: "POST",
      body: form,
    })
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Pipeline request failed (${res.status}): ${text || res.statusText}`)
  }

  return res.json()
}
