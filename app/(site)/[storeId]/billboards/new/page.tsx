import { BillboardForm } from '@/components/form/billboards/BillboardForm'

interface Props {
  params: {
    storeId: string
  }
}

export default async function NewBillboardPage({
  params,
}: Props) {
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardForm storeId={params.storeId} />
      </div>
    </div>
  )
}