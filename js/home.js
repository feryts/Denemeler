/* ===========================================
   EY LIVE — HOME PAGE (home.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  document.getElementById("miniProfile").innerHTML = `
    <a href="profile.html" class="flexCenter" style="gap:8px">
      <div class="avatarCircle" style="width:36px;height:36px;font-size:18px">${me.avatar}</div>
    </a>`;
  document.getElementById("navHost").innerHTML = UI.bottomNav("home");

  const unread = DB.userNotifications(me.id).filter(n => !n.read).length;
  if (unread) document.getElementById("notifDot").outerHTML = `<span class="badgeDot" style="position:absolute;top:-4px;right:-4px">${unread}</span>`;

  const banners = [
    { h: "🎉 Hoş Geldin Bonusu", p: "İlk girişte 100 coin hediye!" },
    { h: "💎 VIP Ol, Ayrıcalıkları Kap", p: "Cüzdan sekmesinden VIP satın al" },
    { h: "🎮 Oyunlarda Şansını Dene", p: "Lucky Slot, Çark ve Zar seni bekliyor" }
  ];
  let bannerIdx = Math.floor(Math.random() * banners.length);
  function renderBanner() {
    const b = banners[bannerIdx];
    document.getElementById("banner").innerHTML = `<div><h3>${b.h}</h3><p>${b.p}</p></div>`;
    document.getElementById("bannerDots").innerHTML = banners.map((_, i) => `<span class="${i === bannerIdx ? "active" : ""}"></span>`).join("");
  }
  renderBanner();
  setInterval(() => { bannerIdx = (bannerIdx + 1) % banners.length; renderBanner(); }, 4000);

  /* daily tasks */
  const tasks = DB.load().dailyTasks;
  document.getElementById("tasksRow").innerHTML = tasks.map(t => `
    <div class="taskChip">
      <div class="tTxt">${t.text}</div>
      <div class="tReward">🎁 +${t.reward} coin</div>
      <button class="btn btnPrimary btnSm btnBlock" onclick="claimTask('${t.id}')">Talep Et</button>
    </div>
  `).join("");

  window.claimTask = (id) => {
    DB.claimDailyTask(me.id, id);
    UI.toast("Görev ödülü alındı! 🎁", "success");
    setTimeout(() => location.reload(), 500);
  };

  /* online users */
  const online = DB.allUsers().filter(u => u.online && u.id !== me.id).slice(0, 12);
  document.getElementById("onlineRow").innerHTML = online.map(u => `
    <a href="profile.html?id=${u.id}" class="onlineCard">
      <div class="avatarCircle" style="width:52px;height:52px;font-size:26px">${u.avatar}<span class="dot"></span></div>
      <div class="n">${UI.esc(u.username)}</div>
    </a>
  `).join("") || `<p class="muted">Şu an çevrimiçi kimse yok</p>`;

  /* agencies */
  const agencies = DB.load().agencies;
  document.getElementById("agencyEvents").innerHTML = agencies.length ? agencies.map(a => {
    const members = a.streamers.slice(0, 4).map(id => DB.getUser(id)).filter(Boolean);
    const lastAnn = a.announcements[0];
    return `
    <a href="agency.html" class="agencyCard">
      <div class="aCover">🏢</div>
      <div class="aBody">
        <div class="aTitle">${UI.esc(a.name)}</div>
        <div class="aTxt">${lastAnn ? UI.esc(lastAnn.text) : a.streamers.length + " yayıncı"}</div>
        <div class="aMembers">${members.map(u => `<div class="avatarCircle">${u.avatar}</div>`).join("") || ""}</div>
      </div>
      <div class="aArrow">›</div>
    </a>`;
  }).join("") : `<p class="muted">Henüz ajans yok</p>`;

  /* rooms + categories */
  const rooms = DB.allRooms();
  const cats = ["Tümü", ...new Set(rooms.map(r => r.category))];
  let activeCat = "Tümü";

  function renderCats() {
    document.getElementById("catTabs").innerHTML = cats.map(c => `
      <button class="pill ${c === activeCat ? "active" : ""}" data-c="${c}">${c}</button>
    `).join("");
    document.querySelectorAll("#catTabs .pill").forEach(btn => {
      btn.onclick = () => { activeCat = btn.dataset.c; renderCats(); renderRooms(); };
    });
  }

  function renderRooms(filterText) {
    let list = rooms;
    if (activeCat !== "Tümü") list = list.filter(r => r.category === activeCat);
    if (filterText) {
      const q = filterText.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(q) || r.tags.some(t => t.includes(q)));
    }
    document.getElementById("roomGrid").innerHTML = list.map(r => {
      const listeners = r.mics.filter(m => m.userId).length;
      const host = DB.getUser(r.hostId);
      return `
      <a href="room.html?id=${r.id}" class="roomCard">
        <div class="cover">${r.cover}${r.locked ? `<div class="lockIcon">🔒</div>` : ""}</div>
        <div class="body">
          <div class="rName">${UI.esc(r.name)}</div>
          <div class="rMeta">
            <span>👤 ${listeners}/12 · Lv.${r.level}</span>
            <span class="live">CANLI</span>
          </div>
        </div>
      </a>`;
    }).join("") || `<div class="emptyState">Aramanla eşleşen oda yok</div>`;
  }

  renderCats();
  renderRooms();

  document.getElementById("searchBox").addEventListener("input", (e) => renderRooms(e.target.value));

})();
