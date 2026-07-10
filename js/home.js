/* ===========================================
   EY LIVE — HOME PAGE (home.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  document.getElementById("navHost").innerHTML = UI.bottomNav("home");

  let homeTab = "parti";

  function renderBenTab() {
    const u = DB.getUser(me.id);
    const myRoom = DB.allRooms().find(r => r.hostId === u.id);
    const followedAgencies = DB.load().agencies;
    document.getElementById("benBody").innerHTML = `
      <a href="${myRoom ? "room.html?id=" + myRoom.id : "profile.html"}" class="agencyCard" style="margin-bottom:14px">
        <div class="aCover">${u.avatar}</div>
        <div class="aBody">
          <div class="aTitle">Benim odam</div>
          <div class="aTxt">Sohbet et ve yeni arkadaşlar edin</div>
        </div>
        <div class="aArrow">›</div>
      </a>
      <div class="scrollRow" style="margin-bottom:14px">
        <button class="pill active">Son zamanlarda</button>
        <button class="pill" onclick="location.href='profile.html'">Takip ettim</button>
        <button class="pill" onclick="location.href='profile.html'">Arkadaşlar</button>
      </div>
      ${followedAgencies.map(a => {
        const members = a.streamers.slice(0, 6).map(id => DB.getUser(id)).filter(Boolean);
        return `
        <a href="agency.html" class="agencyCard" style="margin-bottom:10px">
          <div class="aCover">🏢</div>
          <div class="aBody">
            <div class="aTitle">${UI.esc(a.name)}</div>
            <div class="aMembers">${members.map(mm => `<div class="avatarCircle">${mm.avatar}</div>`).join("")}</div>
          </div>
          <div class="aArrow">${a.streamers.length}</div>
        </a>`;
      }).join("") || `<p class="muted">Henüz takip ettiğin bir ajans yok</p>`}
    `;
  }

  function setTab(t) {
    homeTab = t;
    document.querySelectorAll("#homeTabs .hTab").forEach(el => el.classList.toggle("active", el.dataset.t === t));
    document.getElementById("benBody").style.display = t === "ben" ? "block" : "none";
    document.getElementById("partiBody").style.display = t === "ben" ? "none" : "block";
    document.getElementById("roomsSectionTitle").textContent = t === "canli" ? "📡 Canlı Odalar" : "🔥 Popüler Odalar";
    if (t === "ben") renderBenTab();
    else renderRooms(document.getElementById("searchBox").value);
  }

  document.querySelectorAll("#homeTabs .hTab").forEach(el => {
    el.onclick = () => setTab(el.dataset.t);
  });

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
    if (homeTab === "canli") list = list.filter(r => r.mics.filter(m => m.userId).length > 0);
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

  document.getElementById("searchToggle").onclick = (e) => {
    e.preventDefault();
    const box = document.getElementById("searchBox");
    box.style.display = box.style.display === "none" ? "block" : "none";
    if (box.style.display === "block") box.focus();
  };

})();
