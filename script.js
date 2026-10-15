
const STORE_CONFIG = {
  whatsappNumber: "GANTI_NOMOR_ADMIN",
  products: [
    { id: "rbx80", name: "80 Robux", price: 15000 },
    { id: "rbx160", name: "160 Robux", price: 29000 },
    { id: "rbx400", name: "400 Robux", price: 69000 },
    { id: "rbx800", name: "800 Robux", price: 135000 }
  ]
};

const rupiah = n => new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
}).format(n);

const grid = document.getElementById("product-grid");
const select = document.getElementById("package-select");

if (grid && select) {
  STORE_CONFIG.products.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";

    const title = document.createElement("h3");
    title.textContent = p.name;

    const price = document.createElement("p");
    price.textContent = rupiah(p.price);

    const btn = document.createElement("button");
    btn.textContent = "Pilih paket";
    btn.type = "button";
    btn.onclick = () => {
      select.value = p.id;
      document.getElementById("pesan")?.scrollIntoView({
        behavior: "smooth"
      });
    };

    card.append(title, price, btn);
    grid.appendChild(card);

    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.name} - ${rupiah(p.price)}`;
    select.appendChild(option);
  });
}

const form = document.getElementById("order-form");

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();

    const username =
      document.getElementById("roblox-username").value.trim();
    const product = STORE_CONFIG.products.find(
      p => p.id === select.value
    );
    const payment =
      document.getElementById("payment-select").value;

    if (!username || !product || !payment) {
      alert("Lengkapi data pesanan terlebih dahulu.");
      return;
    }

    const phone = STORE_CONFIG.whatsappNumber;

    if (phone === "GANTI_NOMOR_ADMIN") {
      alert("Nomor WhatsApp admin belum diatur.");
      return;
    }

    const message =
      `Halo Aidenz Store!\nUsername Roblox: ${username}\n` +
      `Paket: ${product.name}\nHarga: ${rupiah(product.price)}\n` +
      `Pembayaran: ${payment}\nMohon konfirmasi pesanan saya.`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  });
}
