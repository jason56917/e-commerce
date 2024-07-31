import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { handle } from 'hono/vercel'
// 引進分支路由模組
import stores from './stores'
import billboards from './billboards'
import categories from './categories'

// 設定這個API在Vercel Edge運行時執行
export const runtime = 'edge'

// 建立一個新的hono實例，並設定基礎路徑為/api
const app = new Hono()

// 設定 CORS，允許來自特定來源的請求
// app.use('*', cors())
app.use('/api/*', cors({
  origin: `${process.env.FRONTED_STORE_URL}`, // 指定允許的前端網址
  allowHeaders: ['Origin', 'Content-Type', 'Authorization'], // 根據需要調整
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // 根據需要調整
  credentials: true, // 如果需要支持 cookies，注意設為treu時，origin需指定前端網址，不可設為*
}))

app.basePath('/api')
  // 掛載分支路由模組到分支路徑
  .route('/stores', stores)
  .route('/billboards', billboards)
  .route('/categories', categories)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
export const OPTIONS = handle(app)

// 導出routes的型別
export type AppType = typeof app