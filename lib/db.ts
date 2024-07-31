import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  // 將 prisma 變數的類型定義為 PrismaClient 的擴展版本或 undefined
  /* eslint-disable no-var */
  var prisma: ReturnType<typeof createPrismaClient> | undefined
  /* eslint-enable no-var */
}

// 創建 PrismaClient 並應用加速擴展功能的工廠函數
function createPrismaClient() {
  return new PrismaClient()
    .$extends(withAccelerate())
}

// 使用全局範圍中的 prisma 或創建一個新的 PrismaClient 實例
export const db = globalThis.prisma || createPrismaClient()

// 在非生產環境中，將 PrismaClient 實例賦值給全局變數
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
