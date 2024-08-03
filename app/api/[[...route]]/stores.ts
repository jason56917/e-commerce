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
        if (!billboards || billboards.length === 0) {
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
        if (!categories || categories.length === 0) {
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
            isFeatured: true,
          },
          include: {
            images: true,
            sizes: true,
            colors: true,
            category: true,
          },
        })
        if (!products || products.length === 0) {
          return c.json({ error: 'No products found' }, 404)
        }

        return c.json(products, 200, {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        })
      } catch (error) {
        console.error('Error fetching store:', error)
        return c.json({ error: 'Internal server error' }, 500)
      }
    }
  )
  .get('/:id/sizes',
    async (c) => {
      const id = c.req.param('id')

      try {
        const sizes = await db.size.findMany({
          where: {
            storeId: id,
          },
        })
        if (!sizes || sizes.length === 0) {
          return c.json({ error: 'Category not found' }, 404)
        }

        return c.json(sizes)
      } catch (error) {
        console.error('Error fetching store:', error)
        return c.json({ error: 'Internal server error' }, 500)
      }
    }
  )
  .get('/:id/colors',
    async (c) => {
      const id = c.req.param('id')

      try {
        const colors = await db.color.findMany({
          where: {
            storeId: id,
          },
        })
        if (!colors || colors.length === 0) {
          return c.json({ error: 'Category not found' }, 404)
        }

        return c.json(colors)
      } catch (error) {
        console.error('Error fetching store:', error)
        return c.json({ error: 'Internal server error' }, 500)
      }
    }
  )

export default app
