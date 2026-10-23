/*
 * AIDENZ STORE — katalog statis.
 * Sebelum publish: ubah nomor WhatsApp dan sesuaikan paket/harga.
 * Tidak ada payment gateway, database, atau pengiriman Robux otomatis.
 */
const STORE_CONFIG = {
  // Format internasional tanpa +, spasi, atau tanda baca.
  // Contoh format: 6281234567890
  whatsappNumber: "6282287221371",

  // Harga normal dan harga promo (diskon sekitar 15%, dibulatkan).
  products: [
    { id: "rbx-80", name: "80 Robux", normalPrice: 15000, price: 13000, description: "Paket starter", badge: "DISKON 15%" },
    { id: "rbx-160", name: "160 Robux", normalPrice: 29000, price: 25000, description: "Paket hemat", badge: "DISKON 15%" },
    { id: "rbx-400", name: "400 Robux", normalPrice: 69000, price: 59000, description: "Pilihan populer", badge: "DISKON 15%" },
    { id: "rbx-800", name: "800 Robux", normalPrice: 135000, price: 115000, description: "Paket besar", badge: "DISKON 15%" },
    { id: "rbx-1000", name: "1.000 Robux", normalPrice: 169000, price: 144000, description: "Paket ekstra", badge: "DISKON 15%" },
    { id: "rbx-1700", name: "1.700 Robux", normalPrice: 282000, price: 240000, description: "Paket pro", badge: "DISKON 15%" },
    { id: "rbx-2000", name: "2.000 Robux", normalPrice: 329000, price: 280000, description: "Paket terbesar", badge: "DISKON 15%" }
  ]
};

const rupiah = (amount) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(amount);

const grid = document.getElementById("product-grid");
const select = document.getElementById("package-select");

STORE_CONFIG.products.forEach((product, index) => {
  const card = document.createElement("article");
  card.className = `product-card${index === 3 ? " featured" : ""}`;

  if (product.badge) {
    const badge = document.createElement("span");
    badge.className = "product-badge";
    badge.textContent = product.badge;
    card.appendChild(badge);
  }

  const symbol = document.createElement("div");
  symbol.className = "product-symbol";
  symbol.textContent = "✦";

  const title = document.createElement("h3");
  title.textContent = product.name;

  const desc = document.createElement("p");
  desc.className = "product-desc";
  desc.textContent = product.description;

  const price = document.createElement("div");
  price.className = "product-price";
  const normalPrice = document.createElement("del");
  normalPrice.className = "product-normal-price";
  normalPrice.textContent = rupiah(product.normalPrice);
  const salePrice = document.createElement("strong");
  salePrice.className = "product-sale-price";
  salePrice.textContent = rupiah(product.price);
  const priceNote = document.createElement("small");
  priceNote.textContent = " / paket";
  price.append(normalPrice, salePrice, priceNote);

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Pilih paket  →";
  button.addEventListener("click", () => {
    select.value = product.id;
    document.getElementById("pesan").scrollIntoView({ behavior: "smooth" });
    document.getElementById("roblox-username").focus({ preventScroll: true });
  });

  card.append(symbol, title, desc, price, button);
  grid.appendChild(card);

  const option = document.createElement("option");
  option.value = product.id;
  option.textContent = `${product.name} — ${rupiah(product.price)} (normal ${rupiah(product.normalPrice)})`;
  select.appendChild(option);
});

document.getElementById("year").textContent = new Date().getFullYear();

let currentOrder = null;

function makeOrderMessage(order) {
  return [
    "Halo Aidenz Store, saya ingin mengonfirmasi pesanan Robux.", "",
    `Nomor pesanan: ${order.id}`,
    `Username Roblox: ${order.username}`,
    `Paket: ${order.productName}`,
    `Total: ${rupiah(order.price)}`,
    `Metode pembayaran pilihan: ${order.payment}`,
    order.note ? `Catatan: ${order.note}` : "",
    "Mohon konfirmasi pesanan dan instruksi pembayaran."
  ].filter(Boolean).join("\n");
}

document.getElementById("order-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("roblox-username").value.trim();
  const product = STORE_CONFIG.products.find((item) => item.id === select.value);
  const payment = document.getElementById("payment-select").value;
  const note = document.getElementById("customer-note").value.trim();
  const error = document.getElementById("form-error");
  error.hidden = true;
  error.textContent = "";
  if (!username || !product || !payment) {
    error.textContent = "Mohon lengkapi username, paket, dan metode pembayaran.";
    error.hidden = false;
    return;
  }
  currentOrder = {
    id: `ADZ-${Date.now().toString().slice(-8)}`,
    username, productId: product.id, productName: product.name,
    price: product.price, payment, note, createdAt: new Date().toISOString(), status: "Menunggu pembayaran"
  };
  document.getElementById("payment-total").textContent = rupiah(product.price);
  document.getElementById("payment-panel").hidden = false;
  document.getElementById("save-status").textContent = `Nomor pesanan: ${currentOrder.id}`;
  document.getElementById("payment-panel").scrollIntoView({behavior:"smooth", block:"start"});
});

document.getElementById("save-order-button").addEventListener("click", () => {
  const status = document.getElementById("save-status");
  if (!currentOrder) { status.textContent = "Isi formulir pesanan terlebih dahulu."; return; }
  try {
    const orders = JSON.parse(localStorage.getItem("aidenzStoreOrders") || "[]");
    if (!orders.some(order => order.id === currentOrder.id)) orders.push(currentOrder);
    localStorage.setItem("aidenzStoreOrders", JSON.stringify(orders));
    status.textContent = `Pesanan ${currentOrder.id} tersimpan di perangkat ini. Simpan nomor pesanan untuk pengecekan.`;
  } catch (e) {
    status.textContent = `Nomor pesanan: ${currentOrder.id}. Penyimpanan perangkat tidak tersedia, catat nomor ini.`;
  }
});

document.getElementById("whatsapp-order-button").addEventListener("click", () => {
  if (!currentOrder) return;
  const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(makeOrderMessage(currentOrder))}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
