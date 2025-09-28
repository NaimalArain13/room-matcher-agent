import { toast as sonnerToast } from "sonner"

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastParams = {
  title: string
  description?: string
  duration?: number
  action?: ToastAction
}

export function useToast() {
  const toast = (params: ToastParams) => {
    const { title, description, duration, action } = params
    sonnerToast(title, {
      description,
      duration,
      action,
    })
  }

  return { toast }
}


