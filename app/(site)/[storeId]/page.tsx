import { getPaidOrdersByStoreId } from '@/actions/orders/getPaidOrdersByStoreId'
import { getPaidOrdersCountByStoreId } from '@/actions/orders/getPaidOrdersCountByStoreId'
import { getArchivedProductsCount } from '@/actions/products/getArchivedProductsCount'
import { Heading } from '@/components/Heading'
import { Overview } from '@/components/overview/Overview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { currencyFormatter } from '@/lib/utils'
import { CreditCard, DollarSign, Package } from 'lucide-react'

interface Props {
  params: {
    storeId: string
  }
}

export default async function StoreIdPage({
  params,
}: Props) {
  const paidOrders = await getPaidOrdersByStoreId(params.storeId)

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.price
    }, 0)
    return total + orderTotal
  }, 0)
  const salesCount = await getPaidOrdersCountByStoreId(params.storeId)
  const stockCount = await getArchivedProductsCount(params.storeId)

  const monthlyRevenue: { [key: number]: number } = {}
  const graphData: { name: string; total: number }[] = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 }
  ]
  for (const order of paidOrders) {
    const month = order.createdAt.getMonth()
    let revenueForOrder = 0

    for (const item of order.orderItems) {
      revenueForOrder += item.price
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder

    for (const month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
    }
  }

  return (
    <div className={'flex flex-col'}>
      <div className={'flex-1 space-y-4 p-8 pt-6'}>
        <Heading
          title={'Dashboard'}
          description={'Overview of your store.'}
        />
        <Separator />
        <div className={'grid grid-cols-3 gap-4'}>
          <Card>
            <CardHeader className={'flex flex-row items-center justify-between space-y-0 pb-2'}>
              <CardTitle className={'text-sm font-medium'}>
                Total Revenue
              </CardTitle>
              <DollarSign className={'h-4 w-4 to-muted-foreground'} />
            </CardHeader>
            <CardContent>
              <div className={'text-2xl font-bold'}>
                {currencyFormatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className={'flex flex-row items-center justify-between space-y-0 pb-2'}>
              <CardTitle className={'text-sm font-medium'}>
                Sales
              </CardTitle>
              <CreditCard className={'h-4 w-4 to-muted-foreground'} />
            </CardHeader>
            <CardContent>
              <div className={'text-2xl font-bold'}>
                +{salesCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className={'flex flex-row items-center justify-between space-y-0 pb-2'}>
              <CardTitle className={'text-sm font-medium'}>
                Products in stock
              </CardTitle>
              <Package className={'h-4 w-4 to-muted-foreground'} />
            </CardHeader>
            <CardContent>
              <div className={'text-2xl font-bold'}>
                {stockCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className={'col-span-4'}>
          <CardHeader>
            <CardTitle>
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className={'pl-2'}>
            <Overview data={graphData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}