import { redirect } from 'next/navigation'
import { getColorById } from '@/actions/colors/getColorById'

import { ColorForm } from '@/components/form/colors/ColorForm'

interface Props {
  params: {
    storeId: string
    colorId: string
  }
}

export default async function ColorIdPage({
  params,
}: Props) {
  const color = await getColorById(params.colorId)

  if (color === null) {
    redirect(`/${params.storeId}/colors`)
  }

  return (
    <div className={'flex-col'}>
      <div className={'flex-1 space-y-4 p-8 pt-6'}>
        <ColorForm
          storeId={params.storeId}
          color={color}
        />
      </div>
    </div>
  )
}