const escpos = require("escpos");
escpos.USB = require("escpos-usb");

const device  = new escpos.USB();
const options = { encoding: "GB18030" /* Türkçe karakter için */ };
const printer = new escpos.Printer(device, options);

module.exports = {
  printKitchen: (order) => {
    device.open(() => {
      printer
        .align("CT")
        .text("MUTFAK")
        .text(`Masa: ${order.table}`)
        .text("------------------------");
      order.items.forEach(item => {
        printer.text(`${item.name} x${item.quantity}`);
      });
      printer.text("------------------------")
        .cut()
        .close();
    });
  },
  printCash: (order) => {
    device.open(() => {
      printer
        .align("CT")
        .text("KASA")
        .text(`Masa: ${order.table}`)
        .text("------------------------");
      order.items.forEach(item => {
        printer.text(`${item.name} x${item.quantity} - ${item.price*item.quantity} TL`);
      });
      printer.text("------------------------")
        .text(`Toplam: ${order.total} TL`)
        .cut()
        .close();
    });
  }
};