import { redirect } from 'next/navigation'
import { getStoreById } from '@/actions/stores/getStoreById'

import { SettingsForm } from '@/components/form/settings/SettingsForm'

interface Props {
  params: {
    storeId: string
  }
}

export default async function SettingsPage({
  params,
}: Props) {
  const store = await getStoreById(params.storeId)
  if (!store) {
    redirect('/')
  }

  return (
    <div className={'flex-col'}>
      <div className={'flex-1 space-y-4 p-8 pt-6'}>
        <SettingsForm store={store} />
      </div>
    </div>
  )
}