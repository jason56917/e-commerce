import { db } from '@/lib/db'
import { Hono } from 'hono'

const app = new Hono()
  .get('/:id',
    async (c) => {
      const id = c.req.param('id')

      try {
        const billboard = await db.billboard.findUnique({
          where: {
            id,
          },
        })
        if (!billboard) {
          return c.json({ error: 'Billboard not found' }, 404)
        }

        return c.json(billboard)
      } catch (error) {
        console.error('Error fetching billboard:', error)
        return c.json({ error: 'Internal server error' }, 500)
      }
    }
  )

export default app