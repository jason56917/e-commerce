import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface Props {
  params: {
    productId: string
  }
}

export async function GET(
  req: Request,
  { params }: Props
) {
  try {
    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 })
    }

    const response = await db.product.findUnique({
      where: {
        id: params.productId,
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
    console.log('ERROR_[productId]_GET', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}