import { getBillboardsByStoreId } from '@/actions/billboards/getBillboardsByStoreId'

import { CategoryForm } from '@/components/form/categories/CategoryForm'

interface Props {
  params: {
    storeId: string
  }
}

export default async function NewCategoryPage({
  params,
}: Props) {
  const billboards = await getBillboardsByStoreId(params.storeId)

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryForm
          storeId={params.storeId}
          billboards={billboards}
        />
      </div>
    </div>
  )
}