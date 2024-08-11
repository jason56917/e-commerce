'use server'

import { db } from '@/lib/db'

export async function getStoresByUserId(
  userId: string
) {
  try {
    const data = await db.store.findMany({
      where: {
        userId,
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