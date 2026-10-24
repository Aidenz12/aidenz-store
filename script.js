/*
 * AIDENZ STORE — katalog statis.
 * Sebelum publish: ubah nomor WhatsApp dan sesuaikan paket/harga.
 * Tidak ada payment gateway, database, atau pengiriman Robux otomatis.
 */
const STORE_CONFIG = {
  // Format internasional tanpa +, spasi, atau tanda baca.
  // Contoh format: 6281234567890
  whatsappNumber: "6282287221371",

  // Harga normal dan harga promo (diskon sekitar 24%, dibulatkan ke ribuan terdekat).
  products: [
    { id: "rbx-280", name: "280 Robux", normalPrice: 50000, price: 38000, description: "Paket starter", badge: "PROMO BUKA TOKO · 24%" },
    { id: "rbx-500", name: "500 Robux", normalPrice: 85000, price: 65000, description: "Paket hemat", badge: "PROMO BUKA TOKO · 24%" },
    { id: "rbx-800", name: "800 Robux", normalPrice: 135000, price: 103000, description: "Pilihan populer", badge: "PROMO BUKA TOKO · 24%" },
    { id: "rbx-1000", name: "1.000 Robux", normalPrice: 169000, price: 128000, description: "Paket ekstra", badge: "PROMO BUKA TOKO · 24%" },
    { id: "rbx-1500", name: "1.500 Robux", normalPrice: 249000, price: 189000, description: "Paket pro", badge: "PROMO BUKA TOKO · 24%" },
    { id: "rbx-2000", name: "2.000 Robux", normalPrice: 329000, price: 250000, description: "Paket terbesar", badge: "PROMO BUKA TOKO · 24%" }
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
