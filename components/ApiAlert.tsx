'use client'

import { Copy, Server } from 'lucide-react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

interface Props {
  title: string
  description: string
  variant: 'public' | 'admin'
}

const textMap = {
  public: 'Public',
  admin: 'Admin',
}

type VariantMap = {
  public: 'secondary'
  admin: 'destructive'
}
const variantMap: VariantMap = {
  public: 'secondary',
  admin: 'destructive',
}

export const ApiAlert = ({
  title,
  description,
  variant,
}: Props) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(description)
    toast.success('API Route copied to the clipboard')
  }

  return (
    <Alert>
      <Server className={'h-4 w-4'} />
      <AlertTitle className={'flex items-center gap-x-2'}>
        {title}
        {/* [variant]表示動態屬性名稱的意思 */}
        {/* 例如當variant是public時 */}
        {/* variantMap[variant]就會找到屬性名稱是public */}
        {/* 結果的值就是secondary */}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className={'mt-4 flex items-center justify-between'}>
        <code className={'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'}>
          {description}
        </code>
        <Button
          variant={'outline'}
          size={'sm'}
          onClick={handleCopy}
        >
          <Copy className={'h-4 w-4'} />
        </Button>
      </AlertDescription>
    </Alert>
  )
}