'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { storeFormSchema, StoreFormType } from '@/prisma/formSchemas'

// 導入在formSchemas建立好的表單欄位型別
export async function createStore(values: StoreFormType) {
  try {
    const { userId } = auth()
    if (!userId) {
      return { error: 'Unauthorized' }
    }

    // 導入在formSchemas建立好的表單欄位規範
    const validatedFields = storeFormSchema.safeParse(values)
    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const { name } = validatedFields.data

    await db.store.create({
      data: {
        name,
        userId,
      },
    })

    // 當此動作完畢後，設定要獲取最新資訊的頁面
    revalidatePath('/')

    return { success: `${name} 商店已建立` }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}