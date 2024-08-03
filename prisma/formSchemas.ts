import * as z from 'zod'

export const storeFormSchema = z.object({
  name: z.string()
    .min(1, {
      message: '請輸入至少一個字元',
    }),
})
export type StoreFormType = z.input<typeof storeFormSchema>

export const billboardFormSchema = z.object({
  name: z.string()
    .min(1, {
      message: '請輸入至少一個字元',
    }),
  imageUrl: z.string()
    .min(1, {
      message: '請上傳背景圖片',
    }),
})
export type BillboardFormType = z.input<typeof billboardFormSchema>

export const categoryFormSchema = z.object({
  name: z.string()
    .min(1, {
      message: '請輸入至少一個字元',
    }),
  imageUrl: z.string()
    .min(1, {
      message: '請上傳背景圖片',
    }),
})
export type CategoryFormType = z.input<typeof categoryFormSchema>

export const sizeFormSchema = z.object({
  name: z.string()
    .min(1, {
      message: '請輸入至少一個字元',
    }),
  value: z.string()
    .min(1, {
      message: '請輸入至少一個字元',
    }),
})
export type SizeFormType = z.input<typeof sizeFormSchema>

export const colorFormSchema = z.object({
  name: z.string()
    .min(1, {
      message: '請輸入至少一個字元',
    }),
  // 必須包含#
  value: z.string()
    .min(4)
    .regex(/^#/, {
      message: '請輸入hex code',
    }),
})
export type ColorFormType = z.input<typeof colorFormSchema>

export const productFormSchema = z.object({
  name: z.string()
    .min(1, {
      message: '請輸入至少一個字元',
    }),
  // 在Input即使設定type='number'，但實際上回傳的值仍然是字串
  // 因此需轉換成透過coerce轉換為數字
  price: z.coerce.number({
    message: '請輸入數字',
  }),
  categoryId: z.string()
    .min(1, {
      message: '請選擇一個category',
    }),
  // 根據schema.prisma的設定，儲存的是物件陣列 Image[]
  // array()預設可接收空陣列
  images: z.object({ imageUrl: z.string() })
    .array()
    .min(1, {
      message: '請選擇至少一張圖片',
    }),
  // 根據schema.prisma的設定，儲存的是字串陣列 String[]
  sizeIds: z.string()
    .array()
    .min(1, {
      message: '請選擇至少一個尺寸',
    }),
  colorIds: z.string()
    .array()
    .min(1, {
      message: '請選擇至少一個顏色',
    }),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
  // isFeatured: z.boolean().optional().default(false),
  // isArchived: z.boolean().optional().default(false)
})
export type ProductFormType = z.input<typeof productFormSchema>