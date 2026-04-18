import { Router } from 'express'
import { db } from '../db/database.js'
import { validateTodo } from '../middleware/validate.js'

const router = Router()

// ── GET /api/todos ──────────────────────────────────────────────────────────
// Query params: ?filter=all|active|completed
router.get('/', async (req, res, next) => {
  try {
    await db.read()
    const { filter } = req.query
    let todos = db.data.todos

    if (filter === 'active')    todos = todos.filter(t => !t.completed)
    if (filter === 'completed') todos = todos.filter(t => t.completed)

    const stats = {
      total:     db.data.todos.length,
      active:    db.data.todos.filter(t => !t.completed).length,
      completed: db.data.todos.filter(t => t.completed).length,
    }

    res.json({ todos, stats })
  } catch (err) {
    next(err)
  }
})

// ── POST /api/todos ─────────────────────────────────────────────────────────
router.post('/', validateTodo, async (req, res, next) => {
  try {
    const { text, priority = 'normal' } = req.body

    if (!text?.trim()) {
      return res.status(400).json({ error: 'text is required' })
    }

    const todo = {
      id:        crypto.randomUUID(),
      text:      text.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
    }

    await db.read()
    db.data.todos.unshift(todo)   // newest first — matches frontend behaviour
    await db.write()

    res.status(201).json(todo)
  } catch (err) {
    next(err)
  }
})

// ── PATCH /api/todos/:id ────────────────────────────────────────────────────
// Handles: text update, toggle completed, priority change — all in one endpoint
router.patch('/:id', validateTodo, async (req, res, next) => {
  try {
    await db.read()
    const todo = db.data.todos.find(t => t.id === req.params.id)

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' })
    }

    const { text, completed, priority } = req.body

    if (text      !== undefined) todo.text      = text.trim()
    if (completed !== undefined) todo.completed = Boolean(completed)
    if (priority  !== undefined) todo.priority  = priority

    todo.updatedAt = Date.now()

    await db.write()
    res.json(todo)
  } catch (err) {
    next(err)
  }
})

// ── DELETE /api/todos/:id ───────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    await db.read()
    const index = db.data.todos.findIndex(t => t.id === req.params.id)

    if (index === -1) {
      return res.status(404).json({ error: 'Todo not found' })
    }

    db.data.todos.splice(index, 1)
    await db.write()

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

// ── DELETE /api/todos/completed/clear ───────────────────────────────────────
router.delete('/completed/clear', async (req, res, next) => {
  try {
    await db.read()
    const before = db.data.todos.length
    db.data.todos = db.data.todos.filter(t => !t.completed)
    await db.write()

    res.json({ deleted: before - db.data.todos.length })
  } catch (err) {
    next(err)
  }
})

export default router
