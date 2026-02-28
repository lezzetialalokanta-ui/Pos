const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const printer = require("./printer");
const platform = require("./platform");
const db = require("./database");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Panel Girişi
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.getUser(username, password);
  if (user) res.json({ success: true, user });
  else res.json({ success: false });
});

// Sipariş ekleme
app.post("/order", (req, res) => {
  const order = req.body;
  const orderId = db.addOrder(order);
  io.emit("new-order", order);  // Tüm bağlı bilgisayarlara bildir
  printer.printKitchen(order);  // Mutfak yazıcısına gönder
  printer.printCash(order);     // Kasa yazıcısına gönder
  res.json({ success: true, orderId });
});

// Platform siparişleri (Webhook ile)
app.post("/platform-order", (req, res) => {
  const order = req.body;
  const orderId = db.addOrder(order);
  io.emit("new-order", order);
  printer.printKitchen(order);
  printer.printCash(order);
  res.json({ success: true, orderId });
});

server.listen(3000, () => {
  console.log("POS sunucusu 3000 portunda çalışıyor");
});
// Webhook endpointleri
const platformApi = require("./platform");

app.post("/webhook/:platform", platformApi.handleWebhook(io, printer, db));