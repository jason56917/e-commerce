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

    const response = await db.color.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.log('ERROR_colors_GET', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}