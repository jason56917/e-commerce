'use client'

import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { DialogName, useDialog } from '@/hook/dialog/useDialog'
import { Billboard, Category, Order, Product, Size } from '@prisma/client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'

interface Props {
  route: string
  dialogName: DialogName
  // 設定資料型別
  data: Billboard | Category | Size | Product | Order
}

export const CellAction = ({
  route,
  dialogName,
  data,
}: Props) => {
  const router = useRouter()

  const dialog = useDialog()

  const handleCopy = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL}/api/${route}/${data.id}`)
    toast.success('API Route copied to the clipboard')
  }

  const handleEdit = () => {
    router.push(`/${data.storeId}/${route}/${data.id}`)
  }

  const handleDelete = () => {
    dialog.onOpen(dialogName, data)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'ghost'}
          className={'h-8 w-8 p-0'}
        >
          <span className={'sr-only'}>
            Open menu
          </span>
          <MoreHorizontal className={'h-4 w-4'} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'}>
        <DropdownMenuLabel>
          Actions
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className={'h-4 w-4 mr-2'} />
          Copy API
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className={'h-4 w-4 mr-2'} />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash className={'h-4 w-4 mr-2'} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}