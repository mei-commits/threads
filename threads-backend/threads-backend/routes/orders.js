const router = require('express').Router();
const { db, nextId } = require('../db');
const { auth, adminOnly } = require('../middleware');
router.get('/', auth, (req, res) => {
  const list = req.user.role === 'admin' ? db.orders : db.orders.filter(o => o.userId === req.user.id);
  res.json({ orders: list.slice().reverse(), total: list.length });
});
router.post('/', auth, (req, res) => {
  const { items, address } = req.body;
  if (!items?.length || !address) return res.status(400).json({ error: 'items and address required' });
  const enriched = [];
  for (const item of items) {
    const p = db.products.find(p => p.id === Number(item.productId));
    if (!p) return res.status(400).json({ error: `Product ${item.productId} not found` });
    enriched.push({ productId: p.id, name: p.name, qty: item.qty, price: p.price });
    p.stock -= item.qty;
  }
  const order = { id: nextId('orders'), userId: req.user.id, userName: req.user.name, items: enriched, total: enriched.reduce((s,i) => s+i.price*i.qty, 0), status: 'pending', address, createdAt: new Date().toISOString() };
  db.orders.push(order);
  res.status(201).json({ order });
});
router.patch('/:id/status', auth, adminOnly, (req, res) => {
  const order = db.orders.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Not found' });
  order.status = req.body.status;
  res.json({ order });
});
module.exports = router;
