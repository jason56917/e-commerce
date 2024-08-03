import { db } from '@/lib/db'
import { Hono } from 'hono'

const app = new Hono()
  .get('/:id',
    async (c) => {
      const id = c.req.param('id')

      try {
        const category = await db.category.findUnique({
          where: {
            id,
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
        if (!category) {
          return c.json({ error: 'Category not found' }, 404)
        }

        return c.json(category)
      } catch (error) {
        console.error('Error fetching category:', error)
        return c.json({ error: 'Internal server error' }, 500)
      }
    }
  )

export default app