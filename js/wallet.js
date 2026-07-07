/* ===========================================
   EY LIVE — WALLET (wallet.js)
=========================================== */

(function () {
  const me0 = UI.requireAuth();
  if (!me0) return;

  document.getElementById("navHost").innerHTML = UI.bottomNav("wallet");

  let historyTab = "purchase";

  function me() { return DB.getUser(me0.id); }

  function render() {
    const u = me();
    const pkgs = DB.load().coinPackages;
    const vips = DB.load().vipLevels;
    document.getElementById("walletPage").innerHTML = `
      ${UI.topBar("Cüzdan")}
      <div class="balanceCard">
        <div class="bItem"><div class="v">💰 ${u.coin}</div><div class="l">Coin</div></div>
        <div class="bItem"><div class="v">💎 ${u.diamond}</div><div class="l">Diamond</div></div>
        <div class="bItem"><div class="v">${UI.vipBadge(u.vip) || "VIP0"}</div><div class="l">VIP Seviyesi</div></div>
      </div>

      <div class="sectionTitle"><span>💰 Coin Satın Al</span></div>
      <div class="pkgGrid">
        ${pkgs.map(p => `
          <div class="pkgCard">
            <div class="pCoin">💰 ${p.coin}</div>
            <div class="pPrice">${p.price}</div>
            <button class="btn btnPrimary btnSm btnBlock" onclick="Wallet.buy('${p.id}')">Satın Al</button>
          </div>`).join("")}
      </div>

      <div class="sectionTitle"><span>👑 VIP Üyelik</span></div>
      <div class="vipGrid">
        ${vips.filter(v => v.level > 0).map(v => `
          <div class="vipCard ${u.vip === v.level ? "current" : ""}">
            <div class="vName">${v.name}</div>
            <div class="vPerk">${v.perks.join("<br>")}</div>
            <div class="muted" style="margin:6px 0">${v.price * 10} coin</div>
            <button class="btn ${u.vip === v.level ? "btnGhost" : "btnPrimary"} btnSm btnBlock" onclick="Wallet.buyVip(${v.level})">
              ${u.vip === v.level ? "Aktif" : "Satın Al"}
            </button>
          </div>`).join("")}
      </div>

      <div class="sectionTitle"><span>💎 Diamond Çekim Talebi</span></div>
      <div class="card">
        <p class="muted" style="margin-bottom:10px">Mevcut: 💎 ${u.diamond} — Kazandığın diamond'ları gerçek paraya çevirmek için talep oluştur.</p>
        <div class="inputRow">
          <input class="input" id="withdrawAmt" placeholder="Miktar" type="number" style="margin-bottom:0">
          <button class="btn btnPrimary" onclick="Wallet.withdraw()">Talep Et</button>
        </div>
      </div>

      <div class="sectionTitle"><span>📜 Geçmiş</span></div>
      <div class="walletTabs">
        <button class="pill ${historyTab === "purchase" ? "active" : ""}" data-t="purchase">Satın Alma</button>
        <button class="pill ${historyTab === "gift" ? "active" : ""}" data-t="gift">Hediye</button>
        <button class="pill ${historyTab === "earning" ? "active" : ""}" data-t="earning">Kazanç</button>
        <button class="pill ${historyTab === "withdraw" ? "active" : ""}" data-t="withdraw">Çekim</button>
      </div>
      <div id="historyBody"></div>
    `;
    document.querySelectorAll(".walletTabs .pill").forEach(btn => {
      btn.onclick = () => { historyTab = btn.dataset.t; render(); };
    });
    renderHistory();
  }

  function renderHistory() {
    const all = DB.userWalletTx(me0.id);
    const filters = {
      purchase: t => t.type === "purchase",
      gift: t => t.type === "gift_sent" || t.type === "gift_received",
      earning: t => t.type === "gift_received" || t.type === "game_win" || t.type === "task_reward",
      withdraw: t => t.type === "withdraw"
    };
    const list = all.filter(filters[historyTab]);
    document.getElementById("historyBody").innerHTML = list.length ? list.map(t => `
      <div class="txRow">
        <div class="tNote">${UI.esc(t.note)}<div class="tTime">${UI.timeAgo(t.ts)}</div></div>
        <div class="tAmt ${t.amount >= 0 ? "pos" : "neg"}">${t.amount >= 0 ? "+" : ""}${t.amount} ${t.currency === "coin" ? "💰" : "💎"}</div>
      </div>
    `).join("") : `<div class="emptyState">Kayıt yok</div>`;
  }

  window.Wallet = {
    buy(pkgId) {
      DB.buyCoins(me0.id, pkgId);
      UI.toast("Satın alma başarılı! 🎉", "success");
      render();
    },
    buyVip(level) {
      const res = DB.buyVip(me0.id, level);
      if (!res.ok) { UI.toast(res.msg || "Hata", "error"); return; }
      UI.toast("VIP satın alındı! 👑", "success");
      render();
    },
    withdraw() {
      const amt = parseInt(document.getElementById("withdrawAmt").value, 10);
      if (!amt || amt <= 0) { UI.toast("Geçerli bir miktar girin", "error"); return; }
      const res = DB.requestWithdraw(me0.id, amt);
      if (!res.ok) { UI.toast(res.msg, "error"); return; }
      UI.toast("Çekim talebi oluşturuldu, incelenecek", "success");
      render();
    }
  };

  render();
})();
