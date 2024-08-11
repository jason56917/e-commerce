import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface Props {
  params: {
    storeId: string
  }
}

export async function GET(
  req: Request,
  { params }: Props
) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const response = await db.size.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.log('ERROR_sizes_GET', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}