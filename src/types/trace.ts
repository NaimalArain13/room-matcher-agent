type LogStatus = "start" | "progress" | "success" | "error"

interface LogEntry<T = unknown> {
  timestamp: Date
  step: string
  status: LogStatus
  data?: T
}

class FlowTracerClass {
  private logs: LogEntry[] = []

  log<T = unknown>(step: string, status: LogStatus, data?: T) {
    const entry: LogEntry<T> = {
      timestamp: new Date(),
      step,
      status,
      data
    }
    this.logs.push(entry)

    const emoji = {
      start: "🚀",
      progress: "⏳",
      success: "✅",
      error: "❌"
    }[status]

    console.log(`${emoji} [${step}]`, status, data ?? "")
  }

  getLogs() {
    return [...this.logs]
  }

  clear() {
    this.logs = []
    console.log("🗑️ Trace cleared")
  }

  exportTrace() {
    const trace = this.logs.map(log => ({
      time: log.timestamp.toISOString(),
      step: log.step,
      status: log.status,
      data: log.data
    }))

    const blob = new Blob([JSON.stringify(trace, null, 2)], {
      type: "application/json"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `room-matcher-trace-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    console.log("💾 Trace exported")
  }
}

export const FlowTracer = new FlowTracerClass()
