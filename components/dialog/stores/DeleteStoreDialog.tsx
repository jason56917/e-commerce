'use client'

import { toast } from 'sonner'
import { useState, useTransition } from 'react'
import { deleteStoreById } from '@/actions/stores/DeleteStoreById'
import { useDialog } from '@/hook/dialog/useDialog'

import { FormError } from '@/components/form/FormError'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '@/components/ui/button'
import { Store } from '@prisma/client'

export const DeleteStoreDialog = () => {
  // 使用管理的hook
  const dialog = useDialog()
  // 需針對Data指定型別
  const dialogData = dialog.data as Store

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleDelete = () => {
    setError('')

    startTransition(() => {
      // 如果有傳遞Data
      if (dialogData) {
        deleteStoreById(dialogData.id)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }
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
      // 此處需增加指定的開啟名稱
      open={dialog.isOpen && dialog.name === 'deleteStore'}
      onOpenChange={dialog.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {dialogData?.name} store
          </DialogTitle>
          <DialogDescription>
            需先清空與此Store有關聯的資料
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