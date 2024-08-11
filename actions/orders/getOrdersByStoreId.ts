'use server'

import { db } from '@/lib/db'

export async function getOrdersByStoreId(
  storeId: string
) {
  try {
    const data = await db.order.findMany({
      where: {
        storeId,
      },
      include: {
        orderItems: true,
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