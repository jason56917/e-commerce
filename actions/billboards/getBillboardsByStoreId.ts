'use server'

import { db } from '@/lib/db'

export async function getBillboardsByStoreId(
  storeId: string
) {
  try {
    const data = await db.billboard.findMany({
      where: {
        storeId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    if (!data) {
      return []
    }

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}