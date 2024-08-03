import { db } from '@/lib/db'
import { Hono } from 'hono'

const app = new Hono()
  .get('/:id',
    async (c) => {
      const id = c.req.param('id')

      try {
        const product = await db.product.findUnique({
          where: {
            id,
          },
          include: {
            images: true,
            sizes: true,
            colors: true,
            category: true,
          },
        })
        if (!product) {
          return c.json({ error: 'product not found' }, 404)
        }

        return c.json(product)
      } catch (error) {
        console.error('Error fetching product:', error)
        return c.json({ error: 'Internal server error' }, 500)
      }
    }
  )
  .get('/:categoryId/products',
    async (c) => {
      const categoryId = c.req.param('categoryId')

      try {
        const product = await db.product.findMany({
          where: {
            categoryId,
          },
          include: {
            images: true,
            sizes: true,
            colors: true,
            category: true,
          },
        })
        if (!product) {
          return c.json({ error: 'product not found' }, 404)
        }

        return c.json(product)
      } catch (error) {
        console.error('Error fetching product:', error)
        return c.json({ error: 'Internal server error' }, 500)
      }
    }
  )

export default app