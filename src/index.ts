import express, { type Request, type Response } from 'express'
import Knex from 'knex'
import { config } from './db/config'
import authRouter from './modules/auth/route'

const app = express()
const db = Knex(config.development)
app.use(express.json())
app.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await db.select().from('users')
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})
app.use('/', authRouter)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
