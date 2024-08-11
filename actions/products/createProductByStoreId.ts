'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { productFormSchema, ProductFormType } from '@/prisma/formSchemas'

// 導入在formSchemas建立好的表單欄位型別
export async function createProductByStoreId(
  storeId: string,
  values: ProductFormType
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return { error: 'Unauthorized' }
    }

    // 導入在formSchemas建立好的表單欄位規範
    const validatedFields = productFormSchema.safeParse(values)
    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const { categoryId, name, price, images, sizeIds, colorIds, isFeatured, isArchived } = validatedFields.data

    await db.product.create({
      data: {
        categoryId,
        name,
        price,
        images: {
          createMany: {
            data: images.map((image) => ({ imageUrl: image.imageUrl })),
          },
        },
        sizeIds,
        colorIds,
        isFeatured,
        isArchived,
        storeId,
      },
    })

    // 當此動作完畢後，設定要獲取最新資訊的頁面
    revalidatePath(`/${storeId}/products`)

    return { success: `${name} 產品已建立` }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}