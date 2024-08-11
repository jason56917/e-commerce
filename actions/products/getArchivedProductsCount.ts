'use server'

import { db } from '@/lib/db'

export async function getArchivedProductsCount(
  storeId: string
) {
  try {
    const archivedCount = await db.product.count({
      where: {
        storeId,
        isArchived: true,
      },
    })

    return archivedCount
  } catch (error) {
    throw new Error((error as Error).message)
  }
}