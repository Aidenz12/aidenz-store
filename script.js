/*
 * AIDENZ STORE — katalog statis.
 * Sebelum publish: ubah nomor WhatsApp dan sesuaikan paket/harga.
 * Tidak ada payment gateway, database, atau pengiriman Robux otomatis.
 */
const STORE_CONFIG = {
  // Format internasional tanpa +, spasi, atau tanda baca.
  // Contoh format: 6281234567890
  whatsappNumber: "6282287221371",

  // Harga promo diskon 50%; harga promo = setengah harga normal.
  products: [
    { id: "rbx-280", name: "280 Robux", normalPrice: 50000, price: 25000, description: "Paket starter", badge: "DISKON 50%" },
    { id: "rbx-400", name: "400 Robux", normalPrice: 68000, price: 34000, description: "Paket hemat", badge: "DISKON 50%" },
    { id: "rbx-500", name: "500 Robux", normalPrice: 85000, price: 42500, description: "Paket hemat", badge: "DISKON 50%" },
    { id: "rbx-600", name: "600 Robux", normalPrice: 102000, price: 51000, description: "Paket pilihan", badge: "DISKON 50%" },
    { id: "rbx-800", name: "800 Robux", normalPrice: 135000, price: 67500, description: "Pilihan populer", badge: "DISKON 50%" },
    { id: "rbx-1000", name: "1.000 Robux", normalPrice: 169000, price: 84500, description: "Paket ekstra", badge: "DISKON 50%" },
    { id: "rbx-1200", name: "1.200 Robux", normalPrice: 203000, price: 101500, description: "Paket ekstra", badge: "DISKON 50%" },
    { id: "rbx-1500", name: "1.500 Robux", normalPrice: 249000, price: 124500, description: "Paket pro", badge: "DISKON 50%" },
    { id: "rbx-1700", name: "1.700 Robux", normalPrice: 282000, price: 141000, description: "Paket pro", badge: "DISKON 50%" },
    { id: "rbx-2000", name: "2.000 Robux", normalPrice: 329000, price: 164500, description: "Paket terbesar", badge: "DISKON 50%" },
    { id: "rbx-2500", name: "2.500 Robux", normalPrice: 410000, price: 205000, description: "Paket besar", badge: "DISKON 50%" },
    { id: "rbx-3000", name: "3.000 Robux", normalPrice: 492000, price: 246000, description: "Paket maksimum", badge: "DISKON 50%" }
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

const ORDER_STORAGE_KEY = "aidenz-store-orders-v1";
function readOrders() {
  try { return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || "[]"); }
  catch (_) { return []; }
}
function saveOrder(order) {
  const orders = readOrders();
  orders.unshift(order);
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders.slice(0, 30)));
}
function renderOrderHistory() {
  const wrap = document.getElementById("order-history");
  const list = document.getElementById("order-history-list");
  list.replaceChildren();
  const orders = readOrders();
  if (!orders.length) {
    const p = document.createElement("p");
    p.textContent = "Belum ada pesanan tersimpan di perangkat ini.";
    list.appendChild(p);
  } else {
    orders.forEach((order) => {
      const item = document.createElement("article");
      item.className = "order-history-item";
      const title = document.createElement("strong");
      title.textContent = `${order.id} · ${order.productName}`;
      const details = document.createElement("p");
      details.textContent = `Username: ${order.username} · Total: ${rupiah(order.price)} · Status: ${order.status}`;
      item.append(title, details);
      list.appendChild(item);
    });
  }
  wrap.hidden = false;
}

document.getElementById("view-orders-button").addEventListener("click", renderOrderHistory);
document.getElementById("order-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("roblox-username").value.trim();
  const product = STORE_CONFIG.products.find((item) => item.id === select.value);
  const note = document.getElementById("customer-note").value.trim();
  const error = document.getElementById("form-error");
  const panel = document.getElementById("payment-panel");
  error.hidden = true;
  error.textContent = "";
  panel.hidden = true;
  if (!username || !product) {
    error.textContent = "Mohon isi username Roblox dan pilih paket.";
    error.hidden = false;
    return;
  }
  currentOrder = {
    id: `ADZ-${Date.now().toString().slice(-8)}`,
    username, productId: product.id, productName: product.name,
    price: product.price, payment: "QRIS", note,
    createdAt: new Date().toISOString(), status: "Menunggu konfirmasi admin"
  };
  try { saveOrder(currentOrder); }
  catch (_) { /* Browser storage may be disabled; current order still works. */ }
  // Send order to Supabase so an authenticated admin can review it.
  // Status remains pending_payment; clicking "Saya Sudah Bayar" never marks it paid.
  try {
    const orderResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: "POST",
      headers: supabaseHeaders({ Prefer: "return=minimal" }),
      body: JSON.stringify({
        order_code: currentOrder.id,
        username: currentOrder.username,
        product_name: currentOrder.productName,
        amount: currentOrder.price,
        payment_method: "QRIS",
        customer_note: currentOrder.note || null,
        status: "pending_payment"
      })
    });
    if (!orderResponse.ok) {
      console.warn("Order belum tersimpan ke daftar admin. Jalankan supabase-orders-admin.sql.", await orderResponse.text());
    }
  } catch (err) {
    console.warn("Order belum tersambung ke daftar admin.", err);
  }
  document.getElementById("payment-total").textContent = rupiah(product.price);
  document.getElementById("save-status").textContent = `Nomor pesanan: ${currentOrder.id} · Simpan nomor ini untuk konfirmasi admin.`;
  document.getElementById("chat-admin-button").href = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(makeOrderMessage(currentOrder))}`;
  document.getElementById("order-history").hidden = true;
  panel.hidden = false;
  let paidBtn = document.getElementById("i-paid-button");
  if (!paidBtn) {
    paidBtn = document.createElement("button");
    paidBtn.type = "button";
    paidBtn.id = "i-paid-button";
    paidBtn.className = "button button-primary";
    paidBtn.textContent = "Saya Sudah Bayar";
    paidBtn.addEventListener("click", async () => {
      currentOrder.status = "Menunggu Konfirmasi";
      try { saveOrder(currentOrder); } catch (_) {}
      const statusLine = document.getElementById("save-status");
      statusLine.textContent = `Pesanan ${currentOrder.id}: Menunggu Konfirmasi. Admin akan memeriksa pembayaran sebelum menyetujui.`;
      const msg = makeOrderMessage(currentOrder) + "\\nStatus: Saya sudah melakukan pembayaran, mohon diperiksa.";
      document.getElementById("chat-admin-button").href = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      alert("Pesanan ditandai menunggu konfirmasi. Status tidak berubah menjadi berhasil sampai admin memeriksa pembayaran.");
    });
    const actions = document.createElement("div");
    actions.className = "payment-actions";
    actions.appendChild(paidBtn);
    panel.appendChild(actions);
  }
  panel.scrollIntoView({behavior:"smooth", block:"start"});
});

// Ulasan bersama memakai Supabase. Isi URL dan anon key setelah membuat project Supabase.
// Hanya ulasan berstatus "approved" yang tampil publik; ulasan baru berstatus "pending".
const SUPABASE_URL = "https://qrodxitwkxwxkdcuuvpr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_dAiJkYB7oLwVf263Z92tjw_I1PlC8L8";
const reviewList = document.getElementById("review-list");
const reviewStatus = document.getElementById("review-status");
const reviewPackageSelect = document.getElementById("review-package");
const reviewForm = document.getElementById("review-form");
const reviewSubmit = reviewForm.querySelector('button[type="submit"]');

STORE_CONFIG.products.forEach((product) => {
  const option = document.createElement("option");
  option.value = product.name;
  option.textContent = product.name;
  reviewPackageSelect.appendChild(option);
});

function supabaseReady() {
  return SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("ISI_URL") &&
    SUPABASE_ANON_KEY.length > 20 && !SUPABASE_ANON_KEY.includes("ISI_ANON");
}
function supabaseHeaders(extra = {}) {
  return { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json", ...extra };
}
function renderReview(review) {
  const card = document.createElement("article");
  card.className = "review-card";
  const top = document.createElement("div");
  top.className = "review-top";
  const avatar = document.createElement("div");
  avatar.className = "review-avatar";
  avatar.textContent = String(review.name || "P").trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
  const identity = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = review.name;
  const meta = document.createElement("small");
  meta.textContent = `Paket: ${review.package_name}`;
  identity.append(name, meta);
  const stars = document.createElement("span");
  stars.className = "review-stars";
  const rating = Math.max(1, Math.min(5, Number(review.rating) || 5));
  stars.setAttribute("aria-label", `Rating ${rating} dari 5 bintang`);
  stars.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);
  top.append(avatar, identity, stars);
  const paragraph = document.createElement("p");
  paragraph.textContent = review.review_text;
  card.append(top, paragraph);
  reviewList.appendChild(card);
}
async function loadApprovedReviews() {
  if (!supabaseReady()) {
    reviewStatus.hidden = false;
    reviewStatus.textContent = "Penyimpanan ulasan belum disambungkan. Admin perlu mengatur Supabase terlebih dahulu.";
    return;
  }
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reviews?select=id,name,package_name,rating,review_text,created_at&status=eq.approved&order=created_at.desc&limit=100`, { headers: supabaseHeaders() });
    if (!response.ok) throw new Error("Gagal memuat ulasan");
    const reviews = await response.json();
    reviewList.replaceChildren();
    if (!reviews.length) {
      reviewStatus.hidden = false;
      reviewStatus.textContent = "Belum ada ulasan yang disetujui. Setelah pelanggan mengirim ulasan dan admin menyetujuinya, ulasan akan tampil di sini.";
      return;
    }
    reviewStatus.hidden = true;
    reviews.forEach(renderReview);
  } catch (error) {
    reviewStatus.hidden = false;
    reviewStatus.textContent = "Ulasan belum bisa dimuat. Coba lagi nanti.";
  }
}
reviewForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("review-name").value.trim();
  const packageName = reviewPackageSelect.value;
  const rating = Number(document.getElementById("review-rating").value);
  const reviewText = document.getElementById("review-text").value.trim();
  if (!name || !packageName || !rating || !reviewText) return;
  if (!supabaseReady()) {
    reviewStatus.hidden = false;
    reviewStatus.textContent = "Form ulasan belum aktif. Admin perlu menyambungkan Supabase terlebih dahulu.";
    reviewStatus.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  reviewSubmit.disabled = true;
  reviewSubmit.textContent = "Mengirim ulasan…";
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
      method: "POST",
      headers: supabaseHeaders({ Prefer: "return=minimal" }),
      body: JSON.stringify({ name, package_name: packageName, rating, review_text: reviewText, status: "pending" })
    });
    if (!response.ok) throw new Error("Ulasan gagal dikirim");
    reviewForm.reset();
    reviewStatus.hidden = false;
    reviewStatus.textContent = "Terima kasih! Ulasan berhasil dikirim dan akan tampil setelah diperiksa serta disetujui.";
    reviewStatus.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    reviewStatus.hidden = false;
    reviewStatus.textContent = "Ulasan belum berhasil dikirim. Periksa koneksi internet lalu coba lagi.";
  } finally {
    reviewSubmit.disabled = false;
    reviewSubmit.innerHTML = 'Kirim ulasan <span>→</span>';
  }
});
loadApprovedReviews();
