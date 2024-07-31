'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { billboardFormSchema, BillboardFormType } from '@/prisma/formSchemas'

// 導入在formSchemas建立好的表單欄位型別
export async function createBillboardByStoreId(
  storeId: string,
  values: BillboardFormType
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return { error: 'Unauthorized' }
    }

    // 導入在formSchemas建立好的表單欄位規範
    const validatedFields = billboardFormSchema.safeParse(values)
    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const { name, imageUrl } = validatedFields.data

    await db.billboard.create({
      data: {
        name,
        imageUrl,
        storeId,
      },
    })

    // 當此動作完畢後，設定要獲取最新資訊的頁面
    revalidatePath(`/${storeId}/billboards`)

    return { success: `${name} 看板已建立` }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}