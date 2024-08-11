'use server'

import { ObjectId } from 'mongodb'
import { db } from '@/lib/db'

export async function getProductById(
  id: string
) {
  try {
    if (!ObjectId.isValid(id)) {
      return null
    }

    const data = await db.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
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