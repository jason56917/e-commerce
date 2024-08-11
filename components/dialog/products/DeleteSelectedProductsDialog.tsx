'use client'

import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deleteProductById } from '@/actions/products/DeleteProductById'
import { useDialog } from '@/hook/dialog/useDialog'
import { useEdgeStore } from '@/lib/edgestore'
import { Image, Product } from '@prisma/client'

import { FormError } from '@/components/form/FormError'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '../../ui/button'

export const DeleteSelectedProductsDialog = () => {
  const { edgestore } = useEdgeStore()

  const params = useParams()


  const dialog = useDialog()
  const dialogData = dialog.data as (Product & { images: Image[] })[]

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleDelete = () => {
    setError('')

    startTransition(async () => {
      if (dialogData) {
        dialogData.map(async (item) => {
          deleteProductById(params.storeId[0], item.id)
            .then(async (data) => {
              if (data.success) {
                toast.success(data.success)

                await Promise.all(item.images.map(async (image) => {
                  await edgestore.publicFiles.delete({ url: image.imageUrl })
                  toast.success('舊圖片已刪除!')
                }))

                dialog.onClose()
              }
            })
            .catch((error: Error) => {
              setError(error.message || 'Something wen wrong!')
            })
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
      open={dialog.isOpen && dialog.name === 'deleteSelectedProducts'}
      onOpenChange={dialog.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete products
          </DialogTitle>
          <DialogDescription>
            若該Product仍有關聯的資料，將會被保留無法刪除
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