'use client'

import { toast } from 'sonner'
import { useState, useTransition } from 'react'
import { deleteOrderById } from '@/actions/orders/DeleteOrderById'

import { FormError } from '@/components/form/FormError'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/hook/dialog/useDialog'
import { Order } from '@prisma/client'

export const DeleteOrderDialog = () => {
  const dialog = useDialog()
  const dialogData = dialog.data as Order

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleDelete = () => {
    setError('')

    startTransition(async () => {
      if (dialogData) {
        deleteOrderById(dialogData.storeId, dialogData.id)
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
      open={dialog.isOpen && dialog.name === 'deleteOrder'}
      onOpenChange={dialog.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {dialogData?.name} order
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