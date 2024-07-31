import { getCategoriesByStoreId } from '@/actions/categories/getCategoriesByStoreId'

import { CategoriesClient } from '@/components/client/categories/CategoriesClient'

interface Props {
  params: {
    storeId: string
  }
}

export default async function CategoriesPage({
  params,
}: Props) {
  // 包含category的上層billboard資料
  const categories = await getCategoriesByStoreId(params.storeId)

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoriesClient
          storeId={params.storeId}
          route={'categories'}
          title={`Categories (${categories.length})`}
          description={'Manage categories for you store'}
          searchKey={'name'}
          searchName={'Name'}
          data={categories}
        />
      </div>
    </div>
  )
}