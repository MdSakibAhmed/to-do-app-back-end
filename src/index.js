import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { initDb } from './db/database.js'
import todosRouter from './routes/todos.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

const PORT = process.env.PORT || 3001
// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}))
app.use(express.json())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/todos', todosRouter)

// ── Error handlers ───────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start ────────────────────────────────────────────────────────────────────
async function start() {
  await initDb()
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Taskr API running on http://localhost:${PORT}`)
    console.log(`   ENV: ${process.env.NODE_ENV || 'development'}`)
  })
}

start()
