'use server'

import { db } from '@/lib/db'

export async function getCategoriesByStoreId(
  storeId: string
) {
  try {
    const data = await db.category.findMany({
      where: {
        storeId,
      },
      // 連帶抓取上層資料
      include: {
        billboard: true,
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