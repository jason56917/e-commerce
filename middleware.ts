import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// 所有路由預設都是公開的，需要自行設定要保護的路由
const isProtectedRoute = createRouteMatcher([
  // 首頁以及之後的路徑都需要保護，但除了/sign-in與/sign-up之外
  '/((?!sign-in|sign-up|api).*)'
  // '/dashboard(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth().protect()

    return NextResponse.next()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(trpc)(.*)'],
}