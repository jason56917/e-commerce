'use client'

import { toast } from 'sonner'
import { useState, useTransition } from 'react'
import { deleteProductById } from '@/actions/products/DeleteProductById'
import { useEdgeStore } from '@/lib/edgestore'

import { FormError } from '@/components/form/FormError'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/hook/dialog/useDialog'
import { Image, Product } from '@prisma/client'

export const DeleteProductDialog = () => {
  const { edgestore } = useEdgeStore()

  const dialog = useDialog()
  const dialogData = dialog.data as Product & { images: Image[] }

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleDelete = () => {
    setError('')

    startTransition(async () => {
      if (dialogData) {
        deleteProductById(dialogData.storeId, dialogData.id)
          .then(async (data) => {
            if (data.success) {
              toast.success(data.success)

              await Promise.all(
                dialogData.images.map(async (image) => {
                  await edgestore.publicFiles.delete({ url: image.imageUrl })
                  // 刪除圖片
                  toast.success('舊圖片已刪除!')
                })
              )
              dialog.onClose()
            }
          })
          .catch((error: Error) => {
            setError(error.message || 'Something wen wrong!')
          })
      }
    })
  }

  const handleCancel = () => {
    setError('')

    dialog.onClose()
  }

  return (
    <Dialog
      open={dialog.isOpen && dialog.name === 'deleteProduct'}
      onOpenChange={dialog.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {dialogData?.name} billboard
          </DialogTitle>
          <DialogDescription>
            需先清空與此Product有關聯的資料
          </DialogDescription>
        </DialogHeader>
        <FormError message={error} />
        <DialogFooter>
          <Button
            disabled={isPending}
            type={'button'}
            variant={'secondary'}
            onClick={handleCancel}
          >
            取消
          </Button>
          <Button
            disabled={isPending}
            type={'button'}
            variant={'destructive'}
            onClick={handleDelete}
          >
            刪除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}