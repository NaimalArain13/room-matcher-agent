"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Download, Trash2, Activity, ChevronDown, ChevronRight, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { FlowTracer } from "@/types/trace"
import { motion, AnimatePresence } from "framer-motion"

export function TraceViewer() {
  const [open, setOpen] = useState(false)
  const [logs, setLogs] = useState(FlowTracer.getLogs())
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set())
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    if (open && autoRefresh) {
      const interval = setInterval(() => {
        setLogs(FlowTracer.getLogs())
      }, 500)
      return () => clearInterval(interval)
    }
  }, [open, autoRefresh])

  const refreshLogs = () => {
    setLogs(FlowTracer.getLogs())
  }

  const toggleExpanded = (idx: number) => {
    const newSet = new Set(expandedIndexes)
    if (newSet.has(idx)) {
      newSet.delete(idx)
    } else {
      newSet.add(idx)
    }
    setExpandedIndexes(newSet)
  }

  const statusConfig = {
    start: { 
      bg: 'bg-slate-100 dark:bg-slate-800', 
      text: 'text-slate-700 dark:text-slate-300', 
      border: 'border-slate-400',
      icon: Loader2,
      iconClass: 'text-slate-500 animate-spin'
    },
    progress: { 
      bg: 'bg-blue-100 dark:bg-blue-900/30', 
      text: 'text-blue-700 dark:text-blue-300', 
      border: 'border-blue-500',
      icon: Loader2,
      iconClass: 'text-blue-500 animate-spin'
    },
    success: { 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-700 dark:text-green-300', 
      border: 'border-green-500',
      icon: CheckCircle2,
      iconClass: 'text-green-500'
    },
    error: { 
      bg: 'bg-red-100 dark:bg-red-900/30', 
      text: 'text-red-700 dark:text-red-300', 
      border: 'border-red-500',
      icon: XCircle,
      iconClass: 'text-red-500'
    }
  }

  const getStepDuration = (idx: number) => {
    if (idx === logs.length - 1) return null
    const current = logs[idx]
    const next = logs[idx + 1]
    if (!next) return null
    
    const diff = next.timestamp.getTime() - current.timestamp.getTime()
    if (diff < 1000) return `${diff}ms`
    return `${(diff / 1000).toFixed(2)}s`
  }

  const totalDuration = logs.length > 1 
    ? ((logs[logs.length - 1].timestamp.getTime() - logs[0].timestamp.getTime()) / 1000).toFixed(2)
    : '0'

  const statusCounts = logs.reduce((acc, log) => {
    acc[log.status] = (acc[log.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => {
          refreshLogs()
          setOpen(true)
        }}
        className="gap-2 relative"
      >
        <Activity className="w-4 h-4" />
        Trace
        {logs.length > 0 && (
          <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
            {logs.length}
          </Badge>
        )}
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Activity className="w-5 h-5 text-white" />
              </div>
              Flow Execution Trace
            </DialogTitle>
            
            {/* Stats Bar */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono">{totalDuration}s total</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-3">
                {statusCounts.success && (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {statusCounts.success} success
                  </span>
                )}
                {statusCounts.error && (
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {statusCounts.error} errors
                  </span>
                )}
                {statusCounts.start && (
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    {statusCounts.start} running
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">No trace data yet</p>
                  <p className="text-sm text-muted-foreground">Upload a file to start tracking the flow</p>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {logs.map((log, idx) => {
                  const config = statusConfig[log.status]
                  const Icon = config.icon
                  const duration = getStepDuration(idx)
                  const isExpanded = expandedIndexes.has(idx)
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`border-l-4 ${config.border} rounded-r-xl overflow-hidden bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-all`}
                    >
                      <div 
                        className={`p-4 cursor-pointer ${config.bg}`}
                        onClick={() => log.data && toggleExpanded(idx)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <Icon className={`w-5 h-5 mt-0.5 ${config.iconClass}`} />
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="font-semibold text-base">{log.step}</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${config.text}`}
                                >
                                  {log.status}
                                </Badge>
                                {duration && (
                                  <span className="text-xs font-mono text-muted-foreground">
                                    +{duration}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span className="font-mono">
                                  {log.timestamp.toLocaleTimeString('en-US', { 
                                    hour12: false, 
                                    hour: '2-digit', 
                                    minute: '2-digit', 
                                    second: '2-digit',
                                    fractionalSecondDigits: 3 
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {log.data && (
                            <button className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                        
                        {log.data && isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 pt-3 border-t border-black/10 dark:border-white/10"
                          >
                            <pre className="text-xs bg-slate-900 dark:bg-slate-950 text-slate-100 p-3 rounded-lg overflow-x-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t gap-4">
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">
                {logs.length} events
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAutoRefresh(!autoRefresh)
                  if (!autoRefresh) refreshLogs()
                }}
                className={autoRefresh ? 'text-blue-600' : ''}
              >
                <Loader2 className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshLogs}
                className="gap-1"
              >
                <Activity className="w-4 h-4" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => FlowTracer.exportTrace()}
                disabled={logs.length === 0}
                className="gap-1"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  FlowTracer.clear()
                  setLogs([])
                  setExpandedIndexes(new Set())
                }}
                disabled={logs.length === 0}
                className="gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}