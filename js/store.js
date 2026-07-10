/* ===========================================
   EY LIVE — MAĞAZA (store.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  const tabs = [
    { key: "cars", label: "Aracım" },
    { key: "frames", label: "Çerçevem" },
    { key: "cards", label: "Özel kart" },
    { key: "balloons", label: "Benim Balonum" }
  ];
  let tab = "cars";

  function render() {
    const u = DB.getUser(me.id);
    const catalog = DB.storeCatalog()[tab] || [];
    const owned = (u.inventory && u.inventory[tab]) || [];

    document.getElementById("storePage").innerHTML = `
      ${UI.topBar("Mağaza", { back: true, right: `<button class="topBtn">🧳</button>` })}

      <div class="storeTabs">
        ${tabs.map(t => `<span class="st ${t.key === tab ? "active" : ""}" onclick="StorePage.setTab('${t.key}')">${t.label}</span>`).join("")}
      </div>

      <div class="storeGrid">
        ${catalog.map(item => {
          const own = owned.find(o => o.id === item.id);
          const active = own && own.expiresAt > Date.now();
          return `
          <div class="storeCard">
            <div class="badgeTime">⏱ ${item.days}Günler</div>
            <div class="thumb">${item.icon}</div>
            <div class="price">🟡 ${item.price.toLocaleString("tr-TR")}</div>
            <div class="actionsRow">
              <button class="btn btnGhost" onclick="UI.toast('${UI.esc(item.name)} — ${item.days} gün süreyle kullanılabilir')">İpuçları</button>
              ${active
                ? `<button class="btn btnPrimary" onclick="StorePage.equip('${item.id}')">Kullan</button>`
                : `<button class="btn btnPrimary" onclick="StorePage.buy('${item.id}')">Almaya git</button>`}
            </div>
          </div>`;
        }).join("")}
      </div>
    `;
  }

  window.StorePage = {
    setTab(t) { tab = t; render(); },
    buy(itemId) {
      const res = DB.buyStoreItem(me.id, tab, itemId);
      if (!res.ok) { UI.toast(res.msg, "error"); return; }
      UI.toast("Satın alındı! 🎉", "success");
      render();
    },
    equip(itemId) {
      DB.equipItem(me.id, tab, itemId);
      UI.toast("Kullanılıyor olarak ayarlandı", "success");
      render();
    }
  };

  render();
})();
