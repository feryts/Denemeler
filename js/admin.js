/* ===========================================
   EY LIVE — ADMIN PANEL (admin.js)
=========================================== */

(function () {
  const me0 = UI.requireAuth();
  if (!me0) return;

  if (me0.role !== "admin") {
    document.getElementById("adminPage").innerHTML = `<div class="emptyState">🚫 Bu sayfaya sadece yöneticiler erişebilir.</div>`;
    return;
  }

  document.getElementById("navHost").innerHTML = UI.bottomNav("profile");

  const tabs = [
    { key: "stats", label: "📊 İstatistik" },
    { key: "users", label: "👤 Kullanıcılar" },
    { key: "agencies", label: "🏢 Ajanslar" },
    { key: "rooms", label: "🎙️ Odalar" },
    { key: "coin", label: "💰 Coin/Diamond" },
    { key: "vip", label: "👑 VIP" },
    { key: "ban", label: "🚫 Ban" },
    { key: "announce", label: "📢 Duyuru" },
    { key: "logs", label: "📜 Loglar" }
  ];
  let active = "stats";

  function shell(body) {
    document.getElementById("adminPage").innerHTML = `
      ${UI.topBar("Admin Panel", { back: true })}
      <div class="adminTabs">
        ${tabs.map(t => `<button class="pill ${active === t.key ? "active" : ""}" data-k="${t.key}">${t.label}</button>`).join("")}
      </div>
      <div id="adminBody">${body}</div>
    `;
    document.querySelectorAll(".adminTabs .pill").forEach(btn => {
      btn.onclick = () => { active = btn.dataset.k; render(); };
    });
  }

  function render() {
    if (active === "stats") return renderStats();
    if (active === "users") return renderUsers();
    if (active === "agencies") return renderAgencies();
    if (active === "rooms") return renderRooms();
    if (active === "coin") return renderCoin();
    if (active === "vip") return renderVip();
    if (active === "ban") return renderBan();
    if (active === "announce") return renderAnnounce();
    if (active === "logs") return renderLogs();
  }

  function renderStats() {
    const s = DB.stats();
    shell(`
      <div class="statsGridAdmin">
        <div class="statCard"><div class="v">${s.totalUsers}</div><div class="l">Toplam Kullanıcı</div></div>
        <div class="statCard"><div class="v">${s.onlineUsers}</div><div class="l">Çevrimiçi</div></div>
        <div class="statCard"><div class="v">${s.totalRooms}</div><div class="l">Oda Sayısı</div></div>
        <div class="statCard"><div class="v">${s.totalAgencies}</div><div class="l">Ajans Sayısı</div></div>
        <div class="statCard"><div class="v">💰 ${s.totalCoin}</div><div class="l">Toplam Coin</div></div>
        <div class="statCard"><div class="v">💎 ${s.totalDiamond}</div><div class="l">Toplam Diamond</div></div>
        <div class="statCard"><div class="v">${s.bannedUsers}</div><div class="l">Banlı Kullanıcı</div></div>
      </div>
    `);
  }

  function renderUsers() {
    const users = DB.allUsers();
    shell(`
      <input class="input" id="userSearch" placeholder="🔍 Kullanıcı ara...">
      <div id="userList"></div>
    `);
    function list(filter) {
      let arr = users;
      if (filter) { const q = filter.toLowerCase(); arr = arr.filter(u => u.username.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)); }
      document.getElementById("userList").innerHTML = arr.map(u => `
        <div class="adminUserRow">
          <div class="avatarCircle" style="width:34px;height:34px;font-size:16px">${u.avatar}</div>
          <div>
            <div class="name">${UI.esc(u.username)} ${u.banned ? "🚫" : ""}</div>
            <div class="meta">${u.id} · ${u.role} · 💰${u.coin} 💎${u.diamond}</div>
          </div>
          <div class="actions">
            <button class="btn btnGhost btnSm" onclick="AdminPanel.editUser('${u.id}')">✏️</button>
            <button class="btn ${u.banned ? "btnSuccess" : "btnDanger"} btnSm" onclick="AdminPanel.toggleBan('${u.id}')">${u.banned ? "Aç" : "Ban"}</button>
          </div>
        </div>`).join("");
    }
    list();
    document.getElementById("userSearch").addEventListener("input", e => list(e.target.value));
  }

  function renderAgencies() {
    const agencies = DB.load().agencies;
    shell(`
      ${agencies.map(a => `
        <div class="card" style="margin-bottom:10px">
          <div class="flexBetween"><b>${UI.esc(a.name)}</b><span class="muted">${a.streamers.length} yayıncı</span></div>
          <div class="muted" style="margin-top:4px">Sahip: ${DB.getUser(a.ownerId)?.username || "?"} · Kazanç: 💰${a.earnings}</div>
        </div>`).join("")}
      <button class="btn btnGhost btnBlock" onclick="AdminPanel.newAgency()">➕ Yeni Ajans Oluştur</button>
    `);
  }

  function renderRooms() {
    const rooms = DB.allRooms();
    shell(`
      ${rooms.map(r => `
        <div class="card" style="margin-bottom:10px">
          <div class="flexBetween">
            <b>${UI.esc(r.name)}</b>
            <button class="btn btnDanger btnSm" onclick="AdminPanel.deleteRoom('${r.id}')">Sil</button>
          </div>
          <div class="muted" style="margin-top:4px">${r.id} · Host: ${DB.getUser(r.hostId)?.username || "?"} · Lv.${r.level} · ${r.mics.filter(m=>m.userId).length}/12</div>
        </div>`).join("")}
    `);
  }

  function renderCoin() {
    shell(`
      <div class="card">
        <label class="fieldLabel">Kullanıcı ID</label>
        <input class="input" id="cUserId" placeholder="EY100000001">
        <label class="fieldLabel">Coin (+/-)</label>
        <input class="input" id="cCoin" type="number" placeholder="örn: 100 veya -50">
        <label class="fieldLabel">Diamond (+/-)</label>
        <input class="input" id="cDiamond" type="number" placeholder="örn: 100 veya -50">
        <button class="btn btnPrimary btnBlock" onclick="AdminPanel.adjustBalance()">Uygula</button>
      </div>
    `);
  }

  function renderVip() {
    const vips = DB.load().vipLevels;
    shell(`
      <div class="card">
        <label class="fieldLabel">Kullanıcı ID</label>
        <input class="input" id="vUserId" placeholder="EY100000001">
        <label class="fieldLabel">VIP Seviyesi</label>
        <select class="input" id="vLevel">
          ${vips.map(v => `<option value="${v.level}">${v.level} - ${v.name}</option>`).join("")}
        </select>
        <button class="btn btnPrimary btnBlock" onclick="AdminPanel.setVip()">Uygula</button>
      </div>
    `);
  }

  function renderBan() {
    const banned = DB.allUsers().filter(u => u.banned);
    shell(`
      <div class="card" style="margin-bottom:16px">
        <label class="fieldLabel">Kullanıcı ID</label>
        <input class="input" id="bUserId" placeholder="EY100000001">
        <label class="fieldLabel">Ban Sebebi</label>
        <input class="input" id="bReason" placeholder="Kural ihlali">
        <button class="btn btnDanger btnBlock" onclick="AdminPanel.banById()">Banla</button>
      </div>
      <div class="sectionTitle"><span>Banlı Kullanıcılar</span></div>
      ${banned.length ? banned.map(u => `
        <div class="adminUserRow">
          <div class="name">${UI.esc(u.username)}</div>
          <div class="meta">${UI.esc(u.banReason)}</div>
          <button class="btn btnSuccess btnSm" style="margin-left:auto" onclick="AdminPanel.toggleBan('${u.id}')">Kaldır</button>
        </div>`).join("") : `<p class="muted">Banlı kullanıcı yok</p>`}
    `);
  }

  function renderAnnounce() {
    const anns = DB.load().announcements;
    shell(`
      <div class="card" style="margin-bottom:16px">
        <label class="fieldLabel">Başlık</label>
        <input class="input" id="anTitle" placeholder="Duyuru başlığı">
        <label class="fieldLabel">Mesaj</label>
        <textarea class="input" id="anText" rows="3" placeholder="Duyuru metni"></textarea>
        <button class="btn btnPrimary btnBlock" onclick="AdminPanel.sendAnnounce()">Herkese Gönder</button>
      </div>
      ${anns.map(a => `<div class="card" style="margin-bottom:8px"><b>${UI.esc(a.title)}</b><div class="muted">${UI.esc(a.text)}</div></div>`).join("")}
    `);
  }

  function renderLogs() {
    const logs = DB.allAdminLogs();
    shell(`
      ${logs.length ? logs.map(l => `
        <div class="logRow">
          <b>${l.action.toUpperCase()}</b> → ${l.target}<br>${UI.esc(l.note)}
          <div class="lMeta">${UI.timeAgo(l.ts)}</div>
        </div>`).join("") : `<p class="muted">Log yok</p>`}
    `);
  }

  window.AdminPanel = {
    editUser(id) {
      const u = DB.getUser(id);
      const role = prompt("Rol (user/streamer/agency/admin/guest):", u.role);
      if (role !== null) { DB.updateUser(id, { role }); DB.addAdminLog("role", id, "Rol: " + role); UI.toast("Güncellendi", "success"); render(); }
    },
    toggleBan(id) {
      const u = DB.getUser(id);
      if (u.banned) DB.unbanUser(id);
      else DB.banUser(id, "Admin tarafından banlandı");
      UI.toast("Durum güncellendi", "success");
      render();
    },
    banById() {
      const id = document.getElementById("bUserId").value.trim();
      const reason = document.getElementById("bReason").value.trim() || "Kural ihlali";
      if (!DB.getUser(id)) { UI.toast("Kullanıcı bulunamadı", "error"); return; }
      DB.banUser(id, reason);
      UI.toast("Kullanıcı banlandı", "success");
      render();
    },
    adjustBalance() {
      const id = document.getElementById("cUserId").value.trim();
      const coin = parseInt(document.getElementById("cCoin").value, 10) || 0;
      const diamond = parseInt(document.getElementById("cDiamond").value, 10) || 0;
      if (!DB.getUser(id)) { UI.toast("Kullanıcı bulunamadı", "error"); return; }
      DB.adminAdjustBalance(id, coin, diamond);
      UI.toast("Bakiye güncellendi", "success");
      render();
    },
    setVip() {
      const id = document.getElementById("vUserId").value.trim();
      const level = parseInt(document.getElementById("vLevel").value, 10);
      if (!DB.getUser(id)) { UI.toast("Kullanıcı bulunamadı", "error"); return; }
      DB.adminSetVip(id, level);
      UI.toast("VIP güncellendi", "success");
      render();
    },
    sendAnnounce() {
      const title = document.getElementById("anTitle").value.trim();
      const text = document.getElementById("anText").value.trim();
      if (!title || !text) { UI.toast("Başlık ve metin girin", "error"); return; }
      DB.globalAnnounce(title, text);
      UI.toast("Duyuru gönderildi", "success");
      render();
    },
    deleteRoom(id) {
      UI.confirm("Bu odayı silmek istiyor musun?", () => {
        DB.deleteRoom(id);
        DB.addAdminLog("delete_room", id, "Oda silindi");
        UI.toast("Oda silindi", "success");
        render();
      });
    },
    newAgency() {
      const name = prompt("Ajans adı:");
      const ownerId = prompt("Sahip kullanıcı ID:");
      if (!name || !DB.getUser(ownerId)) { UI.toast("Geçersiz bilgi", "error"); return; }
      const d = DB.load();
      const id = DB.nextId("AG1", "agency", 7);
      d.agencies.push({ id, name, ownerId, streamers: [], applications: [], earnings: 0, announcements: [] });
      DB.updateUser(ownerId, { role: "agency", agencyId: id });
      DB.save();
      DB.addAdminLog("new_agency", id, name);
      UI.toast("Ajans oluşturuldu", "success");
      render();
    }
  };

  render();
})();
