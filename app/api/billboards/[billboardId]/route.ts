import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface Props {
  params: {
    billboardId: string
  }
}

export async function GET(
  req: Request,
  { params }: Props
) {
  try {
    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 })
    }

    const response = await db.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.log('ERROR_[billboardId]_GET', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}