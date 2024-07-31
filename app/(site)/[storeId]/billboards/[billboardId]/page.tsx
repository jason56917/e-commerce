import { redirect } from 'next/navigation'
import { getBillboardById } from '@/actions/billboards/getBillboardById'

import { BillboardForm } from '@/components/form/billboards/BillboardForm'


interface Props {
  params: {
    storeId: string
    billboardId: string
  }
}

export default async function BillboardIdPage({
  params,
}: Props) {
  const billboard = await getBillboardById(params.billboardId)

  if (billboard === null) {
    redirect(`/${params.storeId}/billboards`)
  }

  return (
    <div className={'flex-col'}>
      <div className={'flex-1 space-y-4 p-8 pt-6'}>
        <BillboardForm
          storeId={params.storeId}
          billboard={billboard}
        />
      </div>
    </div>
  )
}