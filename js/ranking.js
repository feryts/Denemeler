/* ===========================================
   EY LIVE — XENA SIRALAMASI (ranking.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  const cats = [
    { key: "billionaire", label: "Milyarder", metric: u => u.coin, icon: "🟡" },
    { key: "wealth", label: "Servet", metric: u => u.level * 1000 + u.exp, icon: "📶" },
    { key: "charm", label: "Çekicilik", metric: u => u.followers.length * 37 + (u.diamond % 50), icon: "💗" },
    { key: "liveroom", label: "Canlı Oda", metric: u => (DB.allRooms().find(r => r.hostId === u.id) ? u.diamond : 0), icon: "🏠" },
    { key: "voiceroom", label: "Sesli Oda", metric: u => u.publisherExp || 0, icon: "🎙️" }
  ];
  const ranges = ["Günlük", "Haftalık", "Aylık"];
  let cat = "billionaire", range = "Günlük";

  function render() {
    const c = cats.find(x => x.key === cat);
    const list = DB.allUsers()
      .map(u => ({ u, score: c.metric(u) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    const top3 = list.slice(0, 3);
    const rest = list.slice(3);

    document.getElementById("rankPage").innerHTML = `
      ${UI.topBar("Xena Sıralaması", { back: true, right: `<button class="topBtn">🎁</button>` })}

      <div class="rankTabs">
        ${cats.map(x => `<span class="rt ${x.key === cat ? "active" : ""}" onclick="RankPage.setCat('${x.key}')">${x.label}</span>`).join("")}
      </div>

      <div class="rangeTabs">
        ${ranges.map(r => `<span class="rg ${r === range ? "active" : ""}" onclick="RankPage.setRange('${r}')">${r}</span>`).join("")}
      </div>

      <div class="podium">
        ${top3[1] ? podiumStep(top3[1], 2, c) : ""}
        ${top3[0] ? podiumStep(top3[0], 1, c) : ""}
        ${top3[2] ? podiumStep(top3[2], 3, c) : ""}
      </div>

      ${rest.map((row, i) => `
        <div class="rankListRow">
          <span class="rNum">${i + 4}</span>
          <div class="avatarCircle">${row.u.avatar}</div>
          <div>
            <div class="rName">${UI.esc(row.u.username)}</div>
            <div class="rMeta">
              ${UI.vipBadge(row.u.vip)}
              ${row.u.nobleLevel ? `<span class="pill">N${row.u.nobleLevel}</span>` : ""}
            </div>
          </div>
          <span class="rScore">${c.icon} ${row.score.toLocaleString("tr-TR")}</span>
        </div>
      `).join("") || `<p class="muted" style="text-align:center;margin-top:20px">Sıralama boş</p>`}
    `;
  }

  function podiumStep(row, place, c) {
    return `
      <div class="podStep ${place === 1 ? "first" : ""}">
        <div class="avatarCircle">${row.u.avatar}</div>
        <div class="pName">${UI.esc(row.u.username)}</div>
        <div class="pScore">${c.icon} ${row.score.toLocaleString("tr-TR")}</div>
        <div class="rankNum">${place}</div>
      </div>`;
  }

  window.RankPage = {
    setCat(k) { cat = k; render(); },
    setRange(r) { range = r; render(); }
  };

  render();
})();
