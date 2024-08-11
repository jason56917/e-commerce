import { getSizesByStoreId } from '@/actions/sizes/getSizesByStoreId'

import { SizesClient } from '@/components/client/sizes/SizesClient'

interface Props {
  params: {
    storeId: string
  }
}

export default async function SizesPage({
  params,
}: Props) {
  const sizes = await getSizesByStoreId(params.storeId)

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizesClient
          storeId={params.storeId}
          route={'sizes'}
          title={`Sizes (${sizes.length})`}
          description={'Manage sizes for you store'}
          searchKey={'name'}
          searchName={'Name'}
          data={sizes}
        />
      </div>
    </div>
  )
}