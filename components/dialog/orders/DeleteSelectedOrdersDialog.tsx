'use client'

import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deleteOrderById } from '@/actions/orders/DeleteOrderById'
import { useDialog } from '@/hook/dialog/useDialog'
import { Order } from '@prisma/client'

import { FormError } from '@/components/form/FormError'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '../../ui/button'

export const DeleteSelectedOrdersDialog = () => {
  const params = useParams()

  const dialog = useDialog()
  const dialogData = dialog.data as Order[]

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleDelete = () => {
    setError('')

    startTransition(async () => {
      if (dialogData) {
        dialogData.map(async (item) => {
          deleteOrderById(params.storeId[0], item.id)
            .then(async (data) => {
              if (data.success) {
                toast.success(data.success)
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
      open={dialog.isOpen && dialog.name === 'deleteSelectedOrders'}
      onOpenChange={dialog.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete orders
          </DialogTitle>
          <DialogDescription>
            若該Order仍有關聯的資料，將會被保留無法刪除
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