import { redirect } from 'next/navigation'
import { getCategoryById } from '@/actions/categories/getCategoryById'

import { CategoryForm } from '@/components/form/categories/CategoryForm'

interface Props {
  params: {
    storeId: string
    categoryId: string
  }
}

export default async function CategoryIdPage({
  params,
}: Props) {
  const category = await getCategoryById(params.categoryId)

  if (category === null) {
    redirect(`/${params.storeId}/categories`)
  }

  return (
    <div className={'flex-col'}>
      <div className={'flex-1 space-y-4 p-8 pt-6'}>
        <CategoryForm
          storeId={params.storeId}
          category={category}
        />
      </div>
    </div>
  )
}