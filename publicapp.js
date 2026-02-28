const socket = io();

let cart = [];
let total = 0;

document.getElementById("pay-button").addEventListener("click", () => {
  const table = prompt("Masa numarası girin:");
  fetch("/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, items: cart, total })
  }).then(res => res.json()).then(data => {
    alert("Sipariş alındı!");
    cart = [];
    total = 0;
    updateCart();
  });
});

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  cart.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.name} x${item.quantity}`;
    cartItems.appendChild(div);
  });
  document.getElementById("total").textContent = `Toplam: ${total} TL`;
}

// Örnek ürün ekleme
const products = [
  {name:"Adana", price:300},
  {name:"Köfte", price:300},
  {name:"Tavuk Şiş", price:175},
  {name:"Kokoreç", price:350},
];

const grid = document.getElementById("products-grid");
products.forEach(prod => {
  const div = document.createElement("div");
  div.className = "product";
  div.textContent = prod.name;
  div.addEventListener("click", () => {
    const existing = cart.find(i => i.name === prod.name);
    if(existing) existing.quantity++;
    else cart.push({name: prod.name, quantity:1, price: prod.price});
    total += prod.price;
    updateCart();
  });
  grid.appendChild(div);
});

socket.on("new-order", order => {
  alert(`Yeni sipariş geldi! Masa: ${order.table}`);
});
// Platformdan sipariş kontrol
async function fetchPlatformOrders(platform, apiKey){
  const response = await fetch(`/api/platform-orders?platform=${platform}&apiKey=${apiKey}`);
  const orders = await response.json();
  orders.forEach(order => {
    cart = order.items;
    total = order.total;
    updateCart();
    alert(`Yeni platform siparişi geldi! Masa: ${order.table}`);
  });
}

// Örnek 1 dakikada bir kontrol
setInterval(() => {
  fetchPlatformOrders("yemeksepeti", "API_KEYINIZ");
  fetchPlatformOrders("trendyol", "API_KEYINIZ");
  fetchPlatformOrders("getiryemek", "API_KEYINIZ");
}, 60000);