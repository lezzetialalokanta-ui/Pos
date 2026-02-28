const Database = require("better-sqlite3");
const db = new Database("pos.db");

// Kullanıcı tablosu
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  role TEXT
)`).run();

// Sipariş tablosu
db.prepare(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT,
  items TEXT,
  total REAL,
  status TEXT,
  created_at TEXT
)`).run();

module.exports = {
  getUser: (username, password) => {
    return db.prepare("SELECT * FROM users WHERE username=? AND password=?").get(username, password);
  },
  addOrder: (order) => {
    const stmt = db.prepare("INSERT INTO orders (table_name, items, total, status, created_at) VALUES (?, ?, ?, ?, ?)");
    const info = stmt.run(order.table, JSON.stringify(order.items), order.total, "new", new Date().toISOString());
    return info.lastInsertRowid;
  }
};