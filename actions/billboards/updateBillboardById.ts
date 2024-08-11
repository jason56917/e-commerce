'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { billboardFormSchema, BillboardFormType } from '@/prisma/formSchemas'

export async function updateBillboardById(
  storeId: string,
  id: string,
  values: BillboardFormType
) {
  try {
    // 導入在formSchemas建立好的表單欄位規範
    const validatedFields = billboardFormSchema.safeParse(values)
    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const { name, imageUrl } = validatedFields.data

    // 在此處的動作如果發生錯誤
    // 都會由下方的catch區塊接住錯誤
    await db.billboard.update({
      where: {
        id,
      },
      data: {
        name,
        imageUrl,
      },
    })

    // 當此動作完畢後，設定要獲取最新資訊的頁面
    revalidatePath(`/${storeId}/billboards`)
    revalidatePath(`/${storeId}/billboards/${id}`)

    return { success: '已更新' }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}