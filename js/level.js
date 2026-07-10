/* ===========================================
   EY LIVE — SEVİYEM (level.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  let tab = new URLSearchParams(location.search).get("tab") === "publisher" ? "publisher" : "wealth";

  const rewardsFor = {
    wealth: [
      { icon: "🌟", name: "level mark", hint: "kalıcı olmak", need: 0 },
      { icon: "⬆️", name: "high priority", hint: "LV2 unlock", need: 2 },
      { icon: "👑", name: "Avatar frame", hint: "Level 11'ya ulaşınca", need: 11 },
      { icon: "🚗", name: "Exclusive car", hint: "Level 11'ya ulaşınca", need: 11 },
      { icon: "💬", name: "Chat bubble", hint: "Level 51'ya ulaşınca", need: 51 },
      { icon: "🔒", name: "waiting", hint: "", need: 999 }
    ],
    publisher: [
      { icon: "🌟", name: "level mark", hint: "kalıcı olmak", need: 0 },
      { icon: "⬆️", name: "high priority", hint: "LV2 unlock", need: 2 },
      { icon: "👑", name: "Avatar frame", hint: "Level 5'ya ulaşınca", need: 5 },
      { icon: "💬", name: "Chat bubble", hint: "Level 51'ya ulaşınca", need: 51 },
      { icon: "🖼️", name: "Background", hint: "Level 10'ya ulaşınca", need: 10 },
      { icon: "🔒", name: "waiting", hint: "", need: 999 }
    ]
  };

  function render() {
    const u = DB.getUser(me.id);
    const p = tab === "wealth" ? DB.wealthProgress(u) : DB.publisherProgress(u);
    const pct = Math.min(100, Math.round((p.cur / p.need) * 100));
    const rewards = rewardsFor[tab];

    document.getElementById("levelPage").innerHTML = `
      ${UI.topBar("Seviyem", { back: true })}

      <div class="progTabs">
        <span class="pt ${tab === "wealth" ? "active" : ""}" onclick="LevelPage.setTab('wealth')">Servet Seviyesi</span>
        <span class="pt ${tab === "publisher" ? "active" : ""}" onclick="LevelPage.setTab('publisher')">Yayıncı Seviyesi</span>
      </div>

      <div class="progHero">
        <div class="avatarCircle" style="margin:0 auto 8px">${u.avatar}</div>
        <div class="lvName">Lv.${p.level}</div>
      </div>

      <div class="progBarRow">
        <span class="lvTag">Lv.${p.level}</span>
        <div class="progTrack"><div class="fill" style="width:${pct}%"></div></div>
        <span class="lvTag">Lv.${p.next}</span>
      </div>
      <p class="progNote" style="margin-bottom:18px">${p.cur.toLocaleString("tr-TR")} / <b>Yükseltmek için ${p.need.toLocaleString("tr-TR")} EXP gerekiyor</b></p>

      <div class="sectionTitle" style="justify-content:center"><span>◈ Seviye ödülleri ◈</span></div>

      <div class="rewardGrid">
        ${rewards.map(r => `
          <div class="rewardCard ${p.level >= r.need ? "unlocked" : ""}">
            ${p.level < r.need ? `<div class="lockDot">🔒</div>` : ""}
            <div class="rIcon">${r.icon}</div>
            <div class="rName">${r.name}</div>
            <div class="rHint">${r.hint}</div>
          </div>
        `).join("")}
      </div>

      <a href="${tab === "wealth" ? "wallet.html" : "room.html"}" class="ctaBtn">Seviyem nasıl artar?</a>
    `;
  }

  window.LevelPage = {
    setTab(t) { tab = t; render(); }
  };

  render();
})();
