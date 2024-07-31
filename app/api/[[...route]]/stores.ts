import { db } from '@/lib/db'
import { Hono } from 'hono'

const app = new Hono()
  .get('/:id',
    async (c) => {
      const id = c.req.param('id')

      try {
        const store = await db.store.findUnique({
          where: {
            id,
          },
        })
        if (!store) {
          return c.json({ error: 'Store not found' }, 404)
        }

        return c.json(store)
      } catch (error) {
        console.error('Error fetching store:', error)
        return c.json({ error: 'Internal server error' }, 500)
      }
    }
  )
  .get('/:id/billboards',
    async (c) => {
      const id = c.req.param('id')

      try {
        const billboards = await db.billboard.findMany({
          where: {
            storeId: id,
          },
        })
        if (!billboards) {
          return c.json({ error: 'Billboard not found' }, 404)
        }

        return c.json(billboards)
      } catch (error) {
        console.error('Error fetching store:', error)
        return c.json({ error: 'Internal server error' }, 500)
      }
    }
  )
  .get('/:id/categories',
    async (c) => {
      const id = c.req.param('id')

      try {
        const categories = await db.category.findMany({
          where: {
            storeId: id,
          },
        })
        if (!categories) {
          return c.json({ error: 'Category not found' }, 404)
        }

        return c.json(categories)
      } catch (error) {
        console.error('Error fetching store:', error)
        return c.json({ error: 'Internal server error' }, 500)
      }
    }
  )
  .get('/:id/products',
    async (c) => {
      const id = c.req.param('id')

      try {
        const products = await db.product.findMany({
          where: {
            storeId: id,
          },
        })
        if (!products) {
          return c.json({ error: 'Product not found' }, 404)
        }

        return c.json(products)
      } catch (error) {
        console.error('Error fetching store:', error)
        return c.json({ error: 'Internal server error' }, 500)
      }
    }
  )

export default app
