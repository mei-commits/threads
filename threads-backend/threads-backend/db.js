const bcrypt = require('bcryptjs');

const db = {
  users: [],
  products: [],
  orders: [],
  _nextId: { users: 1, products: 100, orders: 1000 },
};

 function nextId(table) {
   return db._nextId[table]++;
 }

 async function seed() {
   const adminHash = await bcrypt.hash('admin123', 10);
   db.users.push({ id: nextId('users'), name: 'Admin', email: 'admin@threads.com', password: adminHash, role: 'admin', createdAt: new Date().toISOString() });
   const userHash = await bcrypt.hash('demo123', 10);
   db.users.push({ id: nextId('users'), name: 'Demo Customer', email: 'demo@example.com', password: userHash, role: 'user', createdAt: new Date().toISOString() });
   const raw = [
     { name:'Classic Oxford Shirt', cat:'men', price:1299, oldPrice:null, badge:'new', sizes:['S','M','L','XL'], img:'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80', stock:45 },
     { name:'Slim Fit Chinos', cat:'men', price:1799, oldPrice:2200, badge:'sale', sizes:['M','L','XL'], img:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', stock:30 },
     { name:'Floral Wrap Dress', cat:'women', price:2199, oldPrice:null, badge:'new', sizes:['XS','S','M','L'], img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80', stock:22 },
     { name:'High-Rise Jeans', cat:'women', price:2499, oldPrice:null, badge:'hot', sizes:['26','28','30','32'], img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', stock:40 },
     { name:'Kids Unisex Hoodie', cat:'kids', price:1099, oldPrice:null, badge:'new', sizes:['4Y','6Y','8Y','10Y','12Y'], img:'https://images.unsplash.com/photo-1532453288672-3a17ac36f101?w=600&q=80', stock:50 },
   ];
   raw.forEach(p => db.products.push({ id: nextId('products'), ...p, createdAt: new Date().toISOString() }));
 }
module.exports = { db, nextId, seed };