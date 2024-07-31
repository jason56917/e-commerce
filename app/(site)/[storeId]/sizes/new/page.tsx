import { SizeForm } from '@/components/form/sizes/SizeForm'

interface Props {
  params: {
    storeId: string
  }
}

export default async function NewSizePage({
  params,
}: Props) {
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeForm storeId={params.storeId} />
      </div>
    </div>
  )
}