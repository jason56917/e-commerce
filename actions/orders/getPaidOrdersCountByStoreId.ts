'use server'

import { db } from '@/lib/db'

export async function getPaidOrdersCountByStoreId(
  storeId: string
) {
  try {
    const data = await db.order.count({
      where: {
        storeId,
        isPaid: true,
      },
    })

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}