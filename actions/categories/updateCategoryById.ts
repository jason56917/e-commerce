'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { categoryFormSchema, CategoryFormType } from '@/prisma/formSchemas'

export async function updateCategoryById(
  storeId: string,
  id: string,
  values: CategoryFormType
) {
  try {
    // 導入在formSchemas建立好的表單欄位規範
    const validatedFields = categoryFormSchema.safeParse(values)
    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const { name, imageUrl } = validatedFields.data

    // 在此處的動作如果發生錯誤
    // 都會由下方的catch區塊接住錯誤
    await db.category.update({
      where: {
        id,
      },
      data: {
        name,
        imageUrl,
      },
    })

    // 當此動作完畢後，設定要獲取最新資訊的頁面
    revalidatePath(`/${storeId}/categories`)
    revalidatePath(`/${storeId}/categories/${id}`)

    return { success: '已更新' }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}