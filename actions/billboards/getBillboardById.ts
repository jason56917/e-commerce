'use server'

import { ObjectId } from 'mongodb'
import { db } from '@/lib/db'

export async function getBillboardById(
  id: string
) {
  try {
    if (!ObjectId.isValid(id)) {
      return null
    }

    const data = await db.billboard.findUnique({
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