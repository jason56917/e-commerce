import { getCategoriesByStoreId } from '@/actions/categories/getCategoriesByStoreId'
import { getColorsByStoreId } from '@/actions/colors/getColorsByStoreId'
import { getSizesByStoreId } from '@/actions/sizes/getSizesByStoreId'
import { ProductForm } from '@/components/form/products/ProductForm'

interface Props {
  params: {
    storeId: string
  }
}

export default async function NewProductPage({
  params,
}: Props) {
  const categories = await getCategoriesByStoreId(params.storeId)
  const sizes = await getSizesByStoreId(params.storeId)
  const colors = await getColorsByStoreId(params.storeId)

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductForm
          storeId={params.storeId}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  )
}