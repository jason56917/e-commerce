'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function deleteOrderById(
  storeId: string,
  id: string
) {
  try {
    // 在此處的動作如果發生錯誤
    // 都會由下方的catch區塊接住錯誤
    await db.order.delete({
      where: {
        id,
      },
    })

    // 當此動作完畢後，設定要獲取最新資訊的頁面
    revalidatePath(`/${storeId}/orders`)

    return { success: '已刪除' }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}