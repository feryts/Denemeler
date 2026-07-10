/* ===========================================
   EY LIVE — VIP MERKEZİ (vip.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  const perks = [
    { icon: "💎", name: "VIP logosu", need: 1 },
    { icon: "🖼️", name: "Başlık çerçevesi", need: 1 },
    { icon: "⬆️", name: "Ön tarafta görüntüleme", need: 1 },
    { icon: "📍", name: "Ziyaretçileri Görüntüle", need: 1 },
    { icon: "💬", name: "Sohbet balonu", need: 2 },
    { icon: "🙈", name: "Son çevrimiçiyi gizle", need: 2 },
    { icon: "🎬", name: "Oda arka planını değiştir", need: 3 },
    { icon: "🎁", name: "Özel hediyeler", need: 4 },
    { icon: "🚫", name: "Arkadaşlık sınırı kaldır", need: 5 }
  ];

  function render() {
    const u = DB.getUser(me.id);
    const p = DB.vipProgress(u);
    const pct = Math.min(100, Math.round((p.cur / p.need) * 100));
    const remain = Math.max(0, p.need - p.cur);

    document.getElementById("vipPage").innerHTML = `
      ${UI.topBar("VIP " + p.level, { back: true, right: `<button class="topBtn" onclick="history.back()">⋯</button>` })}

      <div class="progHero">
        <div class="badgeImg">💎</div>
      </div>

      <p class="progNote">Daha fazla <b>${remain.toLocaleString("tr-TR")}</b> VIP Exp VIP${p.next}'e katılın, birçok ayrıcalıklı ayrıcalığın tadını çıkarın</p>

      <div class="progBarRow">
        <span class="lvTag">VIP${p.level}</span>
        <div class="progTrack"><div class="fill" style="width:${pct}%"></div></div>
        <span class="lvTag">VIP${p.next}</span>
      </div>
      <p class="progNote" style="margin-bottom:20px">Deneyim <b>${p.cur.toLocaleString("tr-TR")}/${p.need.toLocaleString("tr-TR")}</b></p>

      <div class="sectionTitle" style="justify-content:center"><span>◈ VIP ayrıcalıkları ◈</span></div>

      <div class="rewardGrid">
        ${perks.map(pk => `
          <div class="rewardCard ${p.level >= pk.need ? "unlocked" : ""}">
            ${p.level < pk.need ? `<div class="lockDot">🔒</div>` : ""}
            <div class="rIcon">${pk.icon}</div>
            <div class="rName">${pk.name}</div>
            <div class="rHint">${p.level >= pk.need ? "aktif" : "VIP" + pk.need}</div>
          </div>
        `).join("")}
      </div>

      <a href="wallet.html" class="ctaBtn gold">
        ${remain.toLocaleString("tr-TR")} VIP Exp kazanmak için yüklemeye devam edin, VIP${p.next}'e yükseltin — Şimdi yükleme yapın
      </a>
    `;
  }

  render();
})();
