type WingmanPayload = {
  filtered_matches: Array<Record<string, unknown>>
  profiles: Array<Record<string, unknown>>
}

export async function getWingmanAdivce(payload: WingmanPayload, opts?: { method?: "GET" | "POST" }) {
  const preferred = opts?.method || "GET"
  console.log(payload)
  const baseUrl = process.env.NEXT_PUBLIC_API_SERVER
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_SERVER is not configured")

  // Attempt preferred method first
  if (preferred === "GET") {
    const url = new URL(`${baseUrl}/api/wingman`)
    url.searchParams.set("filtered_matches", JSON.stringify(payload.filtered_matches))
    url.searchParams.set("profiles", JSON.stringify(payload.profiles))
    const res = await fetch(url.toString(), { method: "GET" })
    if (res.ok) return res.json()
    if (res.status !== 405) {
      const text = await res.text().catch(() => "")
      throw new Error(`Wingman request failed (${res.status}): ${text || res.statusText}`)
    }
    // If method not allowed, fall back to POST
  }

  const res = await fetch(`${baseUrl}/api/wingman`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Wingman request failed (${res.status}): ${text || res.statusText}`)
  }
  return res.json()
}

// no default export