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
  const paymentChoice = document.getElementById("payment-select").value;
  const note = document.getElementById("customer-note").value.trim();
  const error = document.getElementById("form-error");
  const panel = document.getElementById("payment-panel");
  error.hidden = true;
  error.textContent = "";
  panel.hidden = true;
  if (!username || !product || !["qris", "whatsapp"].includes(paymentChoice)) {
    error.textContent = "Mohon isi username, pilih paket, dan pilih salah satu dari dua opsi pembayaran.";
    error.hidden = false;
    return;
  }
  const paymentLabel = paymentChoice === "qris" ? "QRIS" : "Chat admin WhatsApp";
  currentOrder = {
    id: `ADZ-${Date.now().toString().slice(-8)}`,
    username, productId: product.id, productName: product.name,
    price: product.price, payment: paymentLabel, note,
    createdAt: new Date().toISOString(), status: "Menunggu konfirmasi"
  };
  if (paymentChoice === "whatsapp") {
    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(makeOrderMessage(currentOrder))}`;
    window.location.href = url;
    return;
  }
  document.getElementById("payment-total").textContent = rupiah(product.price);
  document.getElementById("save-status").textContent = `Nomor pesanan: ${currentOrder.id} · Simpan nomor ini untuk konfirmasi admin.`;
  panel.hidden = false;
  panel.scrollIntoView({behavior:"smooth", block:"start"});
});

// ULASAN ASLI: hanya masukkan ulasan pelanggan yang benar-benar diterima dan disetujui.
// Untuk menambahkan ulasan terverifikasi, isi array ini dengan data pelanggan yang telah memberi izin.
// Contoh struktur: { name: "Nama", packageName: "80 Robux", rating: 5, text: "Teks ulasan asli" }
const approvedReviews = [];
const reviewList = document.getElementById("review-list");
const reviewStatus = document.getElementById("review-status");
const reviewPackageSelect = document.getElementById("review-package");

STORE_CONFIG.products.forEach((product) => {
  const option = document.createElement("option");
  option.value = product.name;
  option.textContent = product.name;
  reviewPackageSelect.appendChild(option);
});

function renderApprovedReviews() {
  reviewList.replaceChildren();
  if (approvedReviews.length === 0) {
    reviewStatus.hidden = false;
    reviewStatus.textContent = "Belum ada ulasan pelanggan yang ditampilkan. Jadilah pelanggan pertama yang mengirim ulasan!";
    return;
  }
  reviewStatus.hidden = true;
  approvedReviews.forEach((review) => {
    const card = document.createElement("article");
    card.className = "review-card";
    const top = document.createElement("div");
    top.className = "review-top";
    const avatar = document.createElement("div");
    avatar.className = "review-avatar";
    avatar.textContent = review.name.trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
    const identity = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = review.name;
    const meta = document.createElement("small");
    meta.textContent = `Paket: ${review.packageName}`;
    identity.append(name, meta);
    const stars = document.createElement("span");
    stars.className = "review-stars";
    const rating = Math.max(1, Math.min(5, Number(review.rating) || 5));
    stars.setAttribute("aria-label", `Rating ${rating} dari 5 bintang`);
    stars.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);
    top.append(avatar, identity, stars);
    const paragraph = document.createElement("p");
    paragraph.textContent = review.text;
    card.append(top, paragraph);
    reviewList.appendChild(card);
  });
}

// GitHub Pages bersifat statis: kirim ulasan ke admin untuk pemeriksaan,
// lalu admin menambahkan ulasan yang disetujui ke approvedReviews.
document.getElementById("review-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("review-name").value.trim();
  const packageName = reviewPackageSelect.value;
  const rating = document.getElementById("review-rating").value;
  const text = document.getElementById("review-text").value.trim();
  if (!name || !packageName || !rating || !text) return;
  const message = [
    "Halo Aidenz Store, saya ingin mengirim ulasan pesanan.", "",
    `Nama tampilan: ${name}`,
    `Paket yang dibeli: ${packageName}`,
    `Rating: ${rating}/5`,
    `Ulasan: ${text}`, "",
    "Mohon periksa ulasan ini. Saya mengizinkan nama tampilan dan ulasan ini ditampilkan di website jika disetujui."
  ].join("\n");
  window.location.href = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
});

renderApprovedReviews();
