import { CategoryForm } from '@/components/form/categories/CategoryForm'

interface Props {
  params: {
    storeId: string
  }
}

export default async function NewCategoryPage({
  params,
}: Props) {
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryForm
          storeId={params.storeId}
        />
      </div>
    </div>
  )
}