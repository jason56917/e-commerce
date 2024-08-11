'use client'

import { toast } from 'sonner'
import { useState, useTransition } from 'react'
import { deleteCategoryById } from '@/actions/categories/DeleteCategoryById'
import { useEdgeStore } from '@/lib/edgestore'

import { FormError } from '@/components/form/FormError'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/hook/dialog/useDialog'
import { Category } from '@prisma/client'

export const DeleteCategoryDialog = () => {
  const { edgestore } = useEdgeStore()

  const dialog = useDialog()
  const dialogData = dialog.data as Category

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleDelete = () => {
    setError('')

    startTransition(async () => {
      if (dialogData) {
        deleteCategoryById(dialogData.storeId, dialogData.id)
          .then(async (data) => {
            // if (data.error) {
            //   setError(data.error)
            // }

            if (data.success) {
              toast.success(data.success)

              // 刪除圖片
              await edgestore.publicFiles.delete({ url: dialogData.imageUrl })
              toast.success('舊圖片已刪除!')

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
      open={dialog.isOpen && dialog.name === 'deleteCategory'}
      onOpenChange={dialog.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {dialogData?.name} category
          </DialogTitle>
          <DialogDescription>
            需先清空與此Category有關聯的資料
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