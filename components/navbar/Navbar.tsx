'use client'

import { UserButton } from '@clerk/nextjs'
import { Store } from '@prisma/client'

import { MainNav } from './MainNav'
import { StoreSwitcher } from './StoreSwitcher'
import { ThemeToggle } from './ThemeToggle'

interface Props {
  stores: Store[]
}

export const Navbar = ({
  stores,
}: Props) => {
  return (
    <div className={'border-b'}>
      <div className={'flex h-16 items-center px-4'}>
        <StoreSwitcher stores={stores} />
        <MainNav />
        <div className={'ml-auto flex items-center space-x-4'}>
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  )
}