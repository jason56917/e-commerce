import { db } from '@/lib/db'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()
  .post('/checkout',
    zValidator(
      'json',
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        address: z.string().min(1),
        storeId: z.string().min(1),
        orderItems: z.array(
          z.object({
            product: z.object({
              id: z.string(),
            }),
            amount: z.number().int().positive(),
            size: z.object({
              value: z.string(),
            }),
            color: z.object({
              name: z.string(),
            }),
          })
        ),
      })
    ),
    async (c) => {
      const values = c.req.valid('json')
      console.log(values.storeId)

      try {
        await db.order.create({
          data: {
            storeId: values.storeId,
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
            orderItems: {
              create: values.orderItems.map((item) => ({
                productId: item.product.id,
                amount: item.amount,
                size: item.size.value,
                color: item.color.name,
              })),
            },
            isPaid: true,
          },
        })

        return c.json({ success: '訂單已建立' })
      } catch (error) {
        console.error('Order creation error:', error)
        if (error instanceof z.ZodError) {
          return c.json({ error: '請求數據格式不正確', details: error.errors }, 400)
        }
        return c.json({ error: '訂單建立失敗', message: (error as Error).message }, 500)
      }
    }
  )

export default app