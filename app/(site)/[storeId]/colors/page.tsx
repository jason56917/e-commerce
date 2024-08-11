import { getColorsByStoreId } from '@/actions/colors/getColorsByStoreId'

import { ColorsClient } from '@/components/client/colors/ColorsClient'

interface Props {
  params: {
    storeId: string
  }
}

export default async function ColorsPage({
  params,
}: Props) {
  const colors = await getColorsByStoreId(params.storeId)

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorsClient
          storeId={params.storeId}
          route={'colors'}
          title={`Colors (${colors.length})`}
          description={'Manage colors for you store'}
          searchKey={'name'}
          searchName={'Name'}
          data={colors}
        />
      </div>
    </div>
  )
}