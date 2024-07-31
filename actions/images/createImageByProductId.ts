'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { productFormSchema, ProductFormType } from '@/prisma/formSchemas'

// 導入在formSchemas建立好的表單欄位型別
export async function createImageByProductId(
  // storeId: string,
  productId: string,
  imageUrl: string
) {
  try {
    await db.image.create({
      data: {
        productId,
        imageUrl,
      },
    })

    // 當此動作完畢後，設定要獲取最新資訊的頁面
    // revalidatePath(`/${storeId}/products`)

    return { success: '圖片已上傳' }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}