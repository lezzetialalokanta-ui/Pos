// Platform API entegrasyonu örnek
// Gerçek API anahtarı ve webhook URL buraya girilecek

const axios = require("axios");

module.exports = {

  // Örnek: Platform siparişlerini al
  getOrders: async (platform, apiKey) => {
    try {
      let url = "";
      switch(platform){
        case "yemeksepeti":
          url = `https://api.yemeksepeti.com/orders?apiKey=${apiKey}`;
          break;
        case "trendyol":
          url = `https://api.trendyolyemek.com/orders?apiKey=${apiKey}`;
          break;
        case "getiryemek":
          url = `https://api.getiryemek.com/orders?apiKey=${apiKey}`;
          break;
        default:
          return [];
      }

      const response = await axios.get(url);
      return response.data.orders || [];
    } catch(e){
      console.error("Platform API Hatası:", e.message);
      return [];
    }
  },

  // Webhook ile sipariş geldiğinde
  handleWebhook: (io, printer, db) => {
    return async (req, res) => {
      const order = req.body;
      const orderId = db.addOrder(order);
      io.emit("new-order", order);  // Tüm bağlı bilgisayarlara bildir
      printer.printKitchen(order);
      printer.printCash(order);
      res.json({ success:true, orderId });
    }
  }
};