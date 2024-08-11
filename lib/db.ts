// 從 @prisma/client 引入 PrismaClient 類別，
// 這個類別提供了與資料庫進行 CRUD
// (Create, Read, Update, Delete) 操作的方法
import { PrismaClient } from '@prisma/client'

// 全域範圍中宣告
declare global {
  // prisma變數的型別為PrismaClient或undefined
  /* eslint-disable no-var */
  var prisma: PrismaClient | undefined
  /* eslint-enable no-var */
}

// 因為Next.js使用 HotReload模式，
// 所以先檢查globalThis.prisma，也就是全局的 prisma 變數是否已被建立
// 否則就創建一個新的PrismaClient 實例，並將其賦值給 db
export const db = globalThis.prisma || new PrismaClient()

// 在非生產環境(即開發階段)
// 將 db 值賦予給全局的 prisma變數
// 目的是為了在開發環境中共用同一個 PrismaClient 實例，避免多次建立連線
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db

// 總結來說在第一次使用時，會先建立新的PrismaClient實例
// 並將該實例儲存到 db
// 而在非生產環境(即開發階段)，將 db 儲存到globalThis.prisma
// 因此在第二次之後使用時，將會直接使用已建立的globalThis.prisma
// 因為Next.js使用HotReload模式，如果一直建立新的PrismaClient實例，將會產生錯誤