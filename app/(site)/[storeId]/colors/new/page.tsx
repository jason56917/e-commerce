import { ColorForm } from '@/components/form/colors/ColorForm'

interface Props {
  params: {
    storeId: string
  }
}

export default async function NewColorPage({
  params,
}: Props) {
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorForm storeId={params.storeId} />
      </div>
    </div>
  )
}