'use client'

import { toast } from 'sonner'
import { useState, useTransition } from 'react'
import { deleteSizeById } from '@/actions/sizes/DeleteSizeById'

import { FormError } from '@/components/form/FormError'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/hook/dialog/useDialog'
import { Size } from '@prisma/client'

export const DeleteSizeDialog = () => {
  const dialog = useDialog()
  const dialogData = dialog.data as Size

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleDelete = () => {
    setError('')

    startTransition(async () => {
      if (dialogData) {
        deleteSizeById(dialogData.storeId, dialogData.id)
          .then(async (data) => {
            if (data.success) {
              toast.success(data.success)
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
      open={dialog.isOpen && dialog.name === 'deleteSize'}
      onOpenChange={dialog.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {dialogData?.name} size
          </DialogTitle>
          <DialogDescription>

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