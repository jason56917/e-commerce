import { redirect } from 'next/navigation'
import { getSizeById } from '@/actions/sizes/getSizeById'

import { SizeForm } from '@/components/form/sizes/SizeForm'

interface Props {
  params: {
    storeId: string
    sizeId: string
  }
}

export default async function SizeIdPage({
  params,
}: Props) {
  const size = await getSizeById(params.sizeId)

  if (size === null) {
    redirect(`/${params.storeId}/sizes`)
  }

  return (
    <div className={'flex-col'}>
      <div className={'flex-1 space-y-4 p-8 pt-6'}>
        <SizeForm
          storeId={params.storeId}
          size={size}
        />
      </div>
    </div>
  )
}