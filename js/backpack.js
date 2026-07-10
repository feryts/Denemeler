/* ===========================================
   EY LIVE — SIRT ÇANTASI (backpack.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  const tabs = [
    { key: "cars", label: "Aracım" },
    { key: "frames", label: "Avatar Çerçevem" },
    { key: "cards", label: "Özel kart" },
    { key: "balloons", label: "Benim Koltuğum" }
  ];
  let tab = "cars";

  function render() {
    const owned = DB.userInventory(me.id, tab);
    const catalog = DB.storeCatalog()[tab] || [];

    document.getElementById("bpPage").innerHTML = `
      ${UI.topBar("Sırt çantası", { back: true, right: `<button class="topBtn">🎒</button>` })}

      <div class="storeTabs">
        ${tabs.map(t => `<span class="st ${t.key === tab ? "active" : ""}" onclick="BackpackPage.setTab('${t.key}')">${t.label}</span>`).join("")}
      </div>

      ${owned.length ? `
        <div class="bpGrid">
          ${owned.map(o => {
            const item = catalog.find(c => c.id === o.id);
            if (!item) return "";
            const daysLeft = Math.max(0, Math.ceil((o.expiresAt - Date.now()) / 86400000));
            return `
            <div class="bpItem">
              <div class="thumb">${item.icon}</div>
              <div class="name">${UI.esc(item.name)}</div>
              <div class="expires">${daysLeft} gün kaldı</div>
              <button class="btn btnPrimary btnSm btnBlock" onclick="BackpackPage.equip('${item.id}')">Kullan</button>
            </div>`;
          }).join("")}
        </div>
      ` : `
        <div class="bpEmpty">
          <div class="star">✦</div>
          <p>Şimdi ${tabs.find(t => t.key === tab).label.toLowerCase()} yok. ${tab === "cars" ? "araba" : "bu"} etkisi canlı yayında daha çekici olacak</p>
          <a href="store.html" class="btn btnPrimary btnBlock" style="margin-top:20px">Almaya git</a>
        </div>
      `}
    `;
  }

  window.BackpackPage = {
    setTab(t) { tab = t; render(); },
    equip(itemId) {
      DB.equipItem(me.id, tab, itemId);
      UI.toast("Kullanılıyor olarak ayarlandı", "success");
      render();
    }
  };

  render();
})();
