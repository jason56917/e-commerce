import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

import { CreateStoreDialog } from '@/components/dialog/stores/CreateStoreDialog'

export default async function Home() {
  const { userId } = auth()
  if (!userId) return

  const store = await db.store.findFirst({
    where: {
      userId,
    },
  })
  if (!store) {
    return <CreateStoreDialog open={true} />
  }

  return redirect(`/${store.id}`)
}
