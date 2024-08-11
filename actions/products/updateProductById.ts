'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { productFormSchema, ProductFormType } from '@/prisma/formSchemas'

export async function updateProductById(
  storeId: string,
  id: string,
  values: ProductFormType
) {
  try {
    // 導入在formSchemas建立好的表單欄位規範
    const validatedFields = productFormSchema.safeParse(values)
    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    // 不須解構出images
    const { categoryId, name, price, sizeIds, colorIds, isFeatured, isArchived } = validatedFields.data

    // 在此處的動作如果發生錯誤
    // 都會由下方的catch區塊接住錯誤
    await db.product.update({
      where: {
        id,
      },
      data: {
        categoryId,
        name,
        price,
        sizeIds,
        colorIds,
        isFeatured,
        isArchived,
        storeId,
      },
    })

    // 當此動作完畢後，設定要獲取最新資訊的頁面
    revalidatePath(`/${storeId}/products`)
    revalidatePath(`/${storeId}/products/${id}`)

    return { success: '已更新' }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}