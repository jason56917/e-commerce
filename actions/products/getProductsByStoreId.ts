'use server'

import { db } from '@/lib/db'

export async function getProductsByStoreId(
  storeId: string
) {
  try {
    const data = await db.product.findMany({
      where: {
        storeId,
      },
      include: {
        category: true,
        sizes: true,
        colors: true,
        images: true,
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