import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface Props {
  params: {
    categoryId: string
  }
}

export async function GET(
  req: Request,
  { params }: Props
) {
  try {
    if (!params.categoryId) {
      return new NextResponse('Category id is required', { status: 400 })
    }

    const response = await db.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        products: {
          include: {
            images: true,
            sizes: true,
            colors: true,
          },
        },
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.log('ERROR_[categoryId]_GET', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}