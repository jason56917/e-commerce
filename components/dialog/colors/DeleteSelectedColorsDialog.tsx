'use client'

import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deleteColorById } from '@/actions/colors/DeleteColorById'
import { useDialog } from '@/hook/dialog/useDialog'
import { Color } from '@prisma/client'

import { FormError } from '@/components/form/FormError'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '../../ui/button'

export const DeleteSelectedColorsDialog = () => {
  const params = useParams()

  const dialog = useDialog()
  const dialogData = dialog.data as Color[]

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleDelete = () => {
    setError('')

    startTransition(async () => {
      if (dialogData) {
        dialogData.map(async (item) => {
          deleteColorById(params.storeId[0], item.id)
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
      open={dialog.isOpen && dialog.name === 'deleteSelectedColors'}
      onOpenChange={dialog.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete colors
          </DialogTitle>
          <DialogDescription>
            若該Color仍有關聯的資料，將會被保留無法刪除
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