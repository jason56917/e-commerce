import { redirect } from 'next/navigation'
import { getProductById } from '@/actions/products/getProductById'
import { getCategoriesByStoreId } from '@/actions/categories/getCategoriesByStoreId'
import { getSizesByStoreId } from '@/actions/sizes/getSizesByStoreId'
import { getColorsByStoreId } from '@/actions/colors/getColorsByStoreId'

import { ProductForm } from '@/components/form/products/ProductForm'

interface Props {
  params: {
    storeId: string
    productId: string
  }
}

export default async function ProductIdPage({
  params,
}: Props) {
  const product = await getProductById(params.productId)

  if (product === null) {
    redirect(`/${params.storeId}/products`)
  }

  const categories = await getCategoriesByStoreId(params.storeId)
  const sizes = await getSizesByStoreId(params.storeId)
  const colors = await getColorsByStoreId(params.storeId)

  return (
    <div className={'flex-col'}>
      <div className={'flex-1 space-y-4 p-8 pt-6'}>
        <ProductForm
          storeId={params.storeId}
          product={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  )
}