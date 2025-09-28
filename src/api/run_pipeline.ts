export const runPipeline = async (fileOrPath: File | string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_SERVER
    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_SERVER is not configured")
    }

    let res: Response
    if (typeof fileOrPath === "string") {
        // Backward-compatible: server expects a JSON with file_path
        res = await fetch(`${baseUrl}/api/run-pipeline`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file_path: fileOrPath }),
        })
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