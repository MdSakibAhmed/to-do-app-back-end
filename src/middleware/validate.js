const VALID_PRIORITIES = ['normal', 'medium', 'high']

export function validateTodo(req, res, next) {
  const { text, priority } = req.body

  if (text !== undefined) {
    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'text must be a non-empty string' })
    }
  }

  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
      })
    }
  }

  next()
}
