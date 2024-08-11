'use client'

import { useEffect, useState } from 'react'
import { CreateStoreDialog } from '@/components/dialog/stores/CreateStoreDialog'
import { DeleteStoreDialog } from '@/components/dialog/stores/DeleteStoreDialog'
import { DeleteBillboardDialog } from '@/components/dialog/billboards/DeleteBillboardDialog'
import { DeleteCategoryDialog } from '@/components/dialog/categories/DeleteCategoryDialog'
import { DeleteSizeDialog } from '@/components/dialog/sizes/DeleteSizeDialog'
import { DeleteSelectedBillboardsDialog } from '@/components/dialog/billboards/DeleteSelectedBillboardsDialog'
import { DeleteSelectedCategoriesDialog } from '@/components/dialog/categories/DeleteSelectedCategoriesDialog'
import { DeleteSelectedSizesDialog } from '@/components/dialog/sizes/DeleteSelectedSizesDialog'
import { DeleteColorDialog } from '@/components/dialog/colors/DeleteColorDialog'
import { DeleteSelectedColorsDialog } from '@/components/dialog/colors/DeleteSelectedColorsDialog'
import { DeleteProductDialog } from '@/components/dialog/products/DeleteProductDialog'
import { DeleteSelectedProductsDialog } from '@/components/dialog/products/DeleteSelectedProductsDialog'
import { DeleteOrderDialog } from '@/components/dialog/orders/DeleteOrderDialog'
import { DeleteSelectedOrdersDialog } from '@/components/dialog/orders/DeleteSelectedOrdersDialog'


export const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <CreateStoreDialog />
      <DeleteStoreDialog />
      <DeleteBillboardDialog />
      <DeleteSelectedBillboardsDialog />
      <DeleteCategoryDialog />
      <DeleteSelectedCategoriesDialog />
      <DeleteSizeDialog />
      <DeleteSelectedSizesDialog />
      <DeleteColorDialog />
      <DeleteSelectedColorsDialog />
      <DeleteProductDialog />
      <DeleteSelectedProductsDialog />
      <DeleteOrderDialog />
      <DeleteSelectedOrdersDialog />
    </>
  )
}