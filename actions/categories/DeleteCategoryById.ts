'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function deleteCategoryById(
  storeId: string,
  id: string
) {
  try {
    const productCount = await db.product.count({
      where: {
        categoryId: id,
      },
    })
    if (productCount > 0) {
      return { error: '關聯資料仍存在，無法刪除' }
    }

    // 在此處的動作如果發生錯誤
    // 都會由下方的catch區塊接住錯誤
    await db.category.delete({
      where: {
        id,
      },
    })

    // 當此動作完畢後，設定要獲取最新資訊的頁面
    revalidatePath(`/${storeId}/categories`)

    return { success: '已刪除' }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}