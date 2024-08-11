'use server'

import { ObjectId } from 'mongodb'
import { db } from '@/lib/db'

export async function getStoreById(
  id: string
) {
  try {
    if (!ObjectId.isValid(id)) {
      return null
    }

    const data = await db.store.findUnique({
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