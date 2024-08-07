'use client'

import { CheckCircle2 } from 'lucide-react'

interface FormSuccessProps {
  message?: string
}

export const FormSuccess = ({
  message,
}: FormSuccessProps) => {
  if (!message) return null

  return (
    <div className='flex items-center p-3 gap-x-2 text-sm text-emerald-500 rounded-md bg-emerald-500/15'>
      <CheckCircle2 className='h-4 w-4' />
      <p>{message}</p>
    </div>
  )
}
