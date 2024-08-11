import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface RequestBody {
  storeId: string
  name: string
  email: string
  phone: string
  address: string
  orderItems: {
    product: {
      id: string
      name: string
      price: number
    },
    amount: number,
    size: {
      value: string
    },
    color: {
      name: string
    }
  }[]
}

export async function POST(
  req: Request
) {
  try {
    const { storeId, name, email, phone, address, orderItems }: RequestBody = await req.json()
    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    await db.order.create({
      data: {
        storeId,
        name,
        email,
        phone,
        address,
        orderItems: {
          create: orderItems.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            amount: item.amount,
            size: item.size.value,
            color: item.color.name,
          })),
        },
        isPaid: true,
      },
    })

    return NextResponse.json({ success: '訂單已建立' })
  } catch (error) {
    console.log('ERROR_checkout_GET', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}