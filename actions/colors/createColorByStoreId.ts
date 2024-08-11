'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { colorFormSchema, ColorFormType } from '@/prisma/formSchemas'

// 導入在formSchemas建立好的表單欄位型別
export async function createColorByStoreId(
  storeId: string,
  values: ColorFormType
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return { error: 'Unauthorized' }
    }

    // 導入在formSchemas建立好的表單欄位規範
    const validatedFields = colorFormSchema.safeParse(values)
    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const { name, value } = validatedFields.data

    await db.color.create({
      data: {
        name,
        value,
        storeId,
      },
    })

    // 當此動作完畢後，設定要獲取最新資訊的頁面
    revalidatePath(`/${storeId}/colors`)

    return { success: `${name} 顏色已建立` }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}