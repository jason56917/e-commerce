'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { sizeFormSchema, SizeFormType } from '@/prisma/formSchemas'

export async function updateSizeById(
  storeId: string,
  id: string,
  values: SizeFormType
) {
  try {
    // 導入在formSchemas建立好的表單欄位規範
    const validatedFields = sizeFormSchema.safeParse(values)
    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const { name, value } = validatedFields.data

    // 在此處的動作如果發生錯誤
    // 都會由下方的catch區塊接住錯誤
    await db.size.update({
      where: {
        id,
      },
      data: {
        name,
        value,
        storeId,
      },
    })

    // 當此動作完畢後，設定要獲取最新資訊的頁面
    revalidatePath(`/${storeId}/sizes`)
    revalidatePath(`/${storeId}/sizes/${id}`)

    return { success: '已更新' }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}