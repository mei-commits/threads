const router = require('express').Router();
const { db, nextId } = require('../db');
const { auth, adminOnly } = require('../middleware');
router.get('/', (req, res) => {
  let list = [...db.products];
  const { cat } = req.query;
  if (cat && cat !== 'all') list = cat === 'kids' ? list.filter(p => ['boys','girls','kids'].includes(p.cat)) : list.filter(p => p.cat === cat);
  res.json({ products: list, total: list.length });
});
router.get('/:id', (req, res) => {
  const p = db.products.find(p => p.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json({ product: p });
});
router.post('/', auth, adminOnly, (req, res) => {
  const { name, cat, price } = req.body;
  if (!name || !cat || !price) return res.status(400).json({ error: 'name, cat, price required' });
  const p = { id: nextId('products'), ...req.body, createdAt: new Date().toISOString() };
  db.products.push(p);
  res.status(201).json({ product: p });
});
router.put('/:id', auth, adminOnly, (req, res) => {
  const idx = db.products.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.products[idx] = { ...db.products[idx], ...req.body };
  res.json({ product: db.products[idx] });
});
router.delete('/:id', auth, adminOnly, (req, res) => {
  const idx = db.products.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.products.splice(idx, 1);
  res.json({ message: 'Deleted' });
});
module.exports = router;
