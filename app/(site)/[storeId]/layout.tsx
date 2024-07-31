import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getStoreById } from '@/actions/stores/getStoreById'
import { getStoresByUserId } from '@/actions/stores/getStoresByUserId'

import { Navbar } from '@/components/navbar/Navbar'

interface Props {
  children: React.ReactNode
  params: {
    storeId: string
  }
}

export default async function StoreIdLayout({
  children,
  params,
}: Props) {
  const { userId } = auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // 找出當前網址參數的商店
  const store = await getStoreById(params.storeId)
  if (!store) {
    redirect('/')
  }

  // 找出當前使用者建立的所有商店
  const stores = await getStoresByUserId(userId)
  if (!stores) {
    redirect('/')
  }

  return (
    <div>
      <Navbar stores={stores} />
      {children}
    </div>
  )
}