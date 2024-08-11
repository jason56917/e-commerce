'use server'

import { db } from '@/lib/db'

export async function getSizesByStoreId(
  storeId: string
) {
  try {
    const data = await db.size.findMany({
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