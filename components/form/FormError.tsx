'use client'

import { AlertTriangle } from 'lucide-react'

interface FormErrorProps {
  message?: string
}

export const FormError = ({ message }: FormErrorProps) => {
  // 若沒有訊息就回傳空值，''空字串也算是false
  if (!message) return null

  return (
    <div className='flex items-center p-3 gap-x-2 text-sm text-destructive rounded-md bg-destructive/15'>
      <AlertTriangle className='h-4 w-4' />
      <p>{message}</p>
    </div>
  )
}
