'use server'

import { db } from '@/lib/db'

export async function getColorsByStoreId(
  storeId: string
) {
  try {
    const data = await db.color.findMany({
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