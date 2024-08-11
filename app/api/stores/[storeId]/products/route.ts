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

    const response = await db.product.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        images: true,
        sizes: true,
        colors: true,
        category: true,
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.log('ERROR_products_GET', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}