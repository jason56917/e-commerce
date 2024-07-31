import { ClerkLoaded, ClerkLoading, SignUp } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function Page() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 h-full'>
      <div className='h-full flex flex-col items-center justify-center px-4'>
        <div className='text-center space-y-4 pt-16'>
          <h1 className='font-bold text-3xl text-[#2E2A47]'>
            Welcome Back!
          </h1>
          <p className='text-base text-[#7E8CA0]'>
            Log in or Create account to get back to your dashboard!
          </p>
        </div>
        <div className='flex items-center justify-center mt-8'>
          <ClerkLoaded>
            <SignUp path='/sign-up' />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className='animate-spin text-muted-foreground' />
          </ClerkLoading>
        </div>
      </div>
      <div className='hidden bg-green-400/50 lg:flex items-center justify-center'>
        <Image
          src='/logo.png'
          alt='logo'
          width={100}
          height={100}
        />
      </div>
    </div>
  )
}