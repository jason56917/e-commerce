import { getOrdersByStoreId } from '@/actions/orders/getOrdersByStoreId'

import { OrdersClient } from '@/components/client/orders/OrdersClient'

interface Props {
  params: {
    storeId: string
  }
}

export default async function OrdersPage({
  params,
}: Props) {
  const orders = await getOrdersByStoreId(params.storeId)

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrdersClient
          storeId={params.storeId}
          route={'orders'}
          title={`Orders (${orders.length})`}
          description={'Manage orders for you store'}
          searchKey={'name'}
          searchName={'Name'}
          data={orders}
        />
      </div>
    </div>
  )
}