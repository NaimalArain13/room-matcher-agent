type WingmanPayload = {
  filtered_matches: Array<Record<string, unknown>>
  profiles: Array<Record<string, unknown>>
}

export async function getWingmanAdivce(payload: WingmanPayload) {
  const baseUrl = process.env.NEXT_PUBLIC_API_SERVER
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_SERVER is not configured")

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