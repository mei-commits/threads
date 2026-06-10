const router = require('express').Router();
const { db } = require('../db');
const { auth, adminOnly } = require('../middleware');
function safe(u) { const { password, ...r } = u; return r; }
router.get('/', auth, adminOnly, (req, res) => res.json({ users: db.users.map(safe), total: db.users.length }));
router.get('/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  if (req.user.role !== 'admin' && req.user.id !== id) return res.status(403).json({ error: 'Forbidden' });
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ user: safe(user) });
});
router.delete('/:id', auth, adminOnly, (req, res) => {
  const idx = db.users.findIndex(u => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.users.splice(idx, 1);
  res.json({ message: 'Deleted' });
});
module.exports = router;
