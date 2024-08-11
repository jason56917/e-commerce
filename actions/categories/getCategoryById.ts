'use server'

import { ObjectId } from 'mongodb'
import { db } from '@/lib/db'

export async function getCategoryById(
  id: string
) {
  try {
    // 檢查id是否符合mongoDB的id格式
    if (!ObjectId.isValid(id)) {
      return null
    }

    const data = await db.category.findUnique({
      where: {
        id,
      },
    })
    if (!data) {
      return null
    }

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}