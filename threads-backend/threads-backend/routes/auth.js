const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, nextId } = require('../db');
const { auth } = require('../middleware');
function signToken(u) { return jwt.sign({ id: u.id, email: u.email, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' }); }
function safe(u) { const { password, ...r } = u; return r; }
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (db.users.find(u => u.email === email.toLowerCase())) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = { id: nextId('users'), name, email: email.toLowerCase(), password: hash, role: 'user', createdAt: new Date().toISOString() };
    db.users.push(user);
    res.status(201).json({ token: signToken(user), user: safe(user) });
  } catch { res.status(500).json({ error: 'Server error' }); }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email?.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: signToken(user), user: safe(user) });
  } catch { res.status(500).json({ error: 'Server error' }); }
});
router.get('/me', auth, (req, res) => { const { password, ...u } = req.user; res.json({ user: u }); });
module.exports = router;
