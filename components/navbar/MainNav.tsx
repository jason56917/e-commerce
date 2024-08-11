'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export const MainNav = () => {
  const pathname = usePathname()
  const params = useParams()

  const routes = [
    // 商店首頁
    {
      label: 'Overview',
      href: `/${params.storeId}`,
      active: pathname === `/${params.storeId}`,
    },
    // 告示牌頁
    {
      label: 'Billboards',
      href: `/${params.storeId}/billboards`,
      active: pathname === `/${params.storeId}/billboards`,
    },
    // 分類頁
    {
      label: 'Categories',
      href: `/${params.storeId}/categories`,
      active: pathname === `/${params.storeId}/categories`,
    },
    // 產品頁
    {
      label: 'Products',
      href: `/${params.storeId}/products`,
      active: pathname === `/${params.storeId}/products`,
    },
    // 尺寸頁
    {
      label: 'Sizes',
      href: `/${params.storeId}/sizes`,
      active: pathname === `/${params.storeId}/sizes`,
    },
    // 顏色頁
    {
      label: 'Colors',
      href: `/${params.storeId}/colors`,
      active: pathname === `/${params.storeId}/colors`,
    },
    // 訂購頁
    {
      label: 'Orders',
      href: `/${params.storeId}/orders`,
      active: pathname === `/${params.storeId}/orders`,
    },
    // 商店編輯頁
    {
      label: 'Settings',
      href: `/${params.storeId}/settings`,
      active: pathname === `/${params.storeId}/settings`,
    }
  ]

  return (
    <nav className={'flex items-center space-x-4 lg:space-x-6 mx-6'}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active
              ? 'text-black dark:text-white'
              : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}