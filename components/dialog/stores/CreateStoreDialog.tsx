'use client'

import { useDialog } from '@/hook/dialog/useDialog'

import { CreateStoreForm } from '../../form/stores/CreateStoreForm'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog'

interface Props {
  open?: boolean
}

export const CreateStoreDialog = ({
  open,
}: Props) => {
  const dialog = useDialog()

  return (
    <Dialog
      open={open || dialog.isOpen && dialog.name === 'createStore'}
      onOpenChange={dialog.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create store
          </DialogTitle>
          <DialogDescription>
            Add a new store to manage products and categories.
          </DialogDescription>
        </DialogHeader>
        {/* 內容 */}
        <CreateStoreForm onClose={dialog.onClose} />
      </DialogContent>
    </Dialog>
  )
}