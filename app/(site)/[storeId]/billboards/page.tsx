import { getBillboardsByStoreId } from '@/actions/billboards/getBillboardsByStoreId'

import { BillboardsClient } from '@/components/client/billboards/BillboardsClient'

interface Props {
  params: {
    storeId: string
  }
}

export default async function BillboardsPage({
  params,
}: Props) {
  const billboards = await getBillboardsByStoreId(params.storeId)

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardsClient
          storeId={params.storeId}
          route={'billboards'}
          title={`Billboards (${billboards.length})`}
          description={'Manage billboards for you store'}
          searchKey={'name'}
          searchName={'Name'}
          data={billboards}
        />
      </div>
    </div>
  )
}