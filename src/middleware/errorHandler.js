export function notFound(req, res, next) {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const message = err.message || 'Internal server error'
  console.error(`[${status}] ${message}`, err.stack)
  res.status(status).json({ error: message })
}
