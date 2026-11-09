const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });

const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID format' });
  if (err.code === 11000) return res.status(400).json({ message: 'Duplicate value — already exists' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
};

module.exports = { notFound, errorHandler };