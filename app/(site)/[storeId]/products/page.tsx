import { getProductsByStoreId } from '@/actions/products/getProductsByStoreId'

import { ProductsClient } from '@/components/client/products/ProductsClient'

interface Props {
  params: {
    storeId: string
  }
}

export default async function ProductsPage({
  params,
}: Props) {
  const products = await getProductsByStoreId(params.storeId)

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductsClient
          storeId={params.storeId}
          route={'products'}
          title={`Products (${products.length})`}
          description={'Manage products for you store'}
          searchKey={'name'}
          searchName={'Name'}
          data={products}
        />
      </div>
    </div>
  )
}