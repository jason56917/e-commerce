import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getStoresByUserId } from '@/actions/stores/getStoresByUserId'

import { Navbar } from '@/components/navbar/Navbar'

interface Props {
  children: React.ReactNode
}

export default async function StoreIdLayout({
  children,
}: Props) {
  const { userId } = auth()
  if (!userId) {
    redirect('/sign-in')
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