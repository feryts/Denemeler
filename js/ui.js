/* ===========================================
   EY LIVE — SHARED UI HELPERS (ui.js)
=========================================== */

const UI = {

  requireAuth() {
    const u = DB.currentUser();
    if (!u) {
      window.location.href = "index.html";
      return null;
    }
    if (u.banned) {
      document.body.innerHTML = `
        <div class="banScreen">
          <div class="banBox">
            <h2>🚫 Hesabınız Askıya Alındı</h2>
            <p>${UI.esc(u.banReason || "Kural ihlali")}</p>
            <button class="btn btnGhost" onclick="UI.logout()">Çıkış Yap</button>
          </div>
        </div>`;
      return null;
    }
    return u;
  },

  logout() {
    DB.clearSession();
    window.location.href = "index.html";
  },

  toast(msg, type = "info") {
    let host = document.getElementById("toastHost");
    if (!host) {
      host = document.createElement("div");
      host.id = "toastHost";
      host.className = "toastHost";
      document.body.appendChild(host);
    }
    const el = document.createElement("div");
    el.className = "toast toast-" + type;
    el.textContent = msg;
    host.appendChild(el);
    setTimeout(() => el.classList.add("show"), 10);
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, 2600);
  },

  esc(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  },

  timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "az önce";
    if (s < 3600) return Math.floor(s / 60) + " dk önce";
    if (s < 86400) return Math.floor(s / 3600) + " sa önce";
    return Math.floor(s / 86400) + " gün önce";
  },

  vipBadge(vip) {
    if (!vip) return "";
    const colors = ["", "#cd7f32", "#c0c0c0", "#ffd700", "#66d9ff", "#38bdf8", "#c084fc", "#ff2e9e"];
    return `<span class="vipBadge" style="background:${colors[vip]}">VIP${vip}</span>`;
  },

  roleBadge(role) {
    const map = {
      admin: "👑 Admin", agency: "🏢 Ajans", streamer: "🎤 Yayıncı",
      user: "", guest: "Misafir"
    };
    return map[role] ? `<span class="roleBadge">${map[role]}</span>` : "";
  },

  avatarHtml(user, size = 44) {
    return `<div class="avatarCircle" style="width:${size}px;height:${size}px;font-size:${size * 0.55}px">${user ? user.avatar : "🙂"}</div>`;
  },

  bottomNav(active) {
    const items = [
      { key: "home", icon: "🏠", label: "Ana Sayfa", href: "home.html" },
      { key: "games", icon: "🎮", label: "Oyunlar", href: "games.html" },
      { key: "messages", icon: "💬", label: "Mesajlar", href: "messages.html" },
      { key: "wallet", icon: "💰", label: "Cüzdan", href: "wallet.html" },
      { key: "profile", icon: "👤", label: "Profil", href: "profile.html" }
    ];
    return `
      <nav class="bottomNav">
        ${items.map(i => `
          <a href="${i.href}" class="navItem ${active === i.key ? "active" : ""}">
            <span class="navIcon">${i.icon}</span>
            <span class="navLabel">${i.label}</span>
          </a>
        `).join("")}
      </nav>`;
  },

  topBar(title, opts = {}) {
    return `
      <div class="topBar">
        ${opts.back ? `<button class="topBtn" onclick="history.back()">←</button>` : `<span class="topBtn" style="visibility:hidden">←</span>`}
        <h1 class="topTitle">${title}</h1>
        ${opts.right || `<span class="topBtn" style="visibility:hidden">·</span>`}
      </div>`;
  },

  renderNotifBadge(user) {
    const n = DB.userNotifications(user.id).filter(x => !x.read).length;
    return n > 0 ? `<span class="badgeDot">${n > 9 ? "9+" : n}</span>` : "";
  },

  confirm(msg, onYes) {
    const wrap = document.createElement("div");
    wrap.className = "modalOverlay";
    wrap.innerHTML = `
      <div class="modalBox">
        <p style="margin-bottom:18px">${UI.esc(msg)}</p>
        <div style="display:flex;gap:10px">
          <button class="btn btnGhost" style="flex:1" id="cfNo">Vazgeç</button>
          <button class="btn btnPrimary" style="flex:1" id="cfYes">Onayla</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    wrap.querySelector("#cfNo").onclick = () => wrap.remove();
    wrap.querySelector("#cfYes").onclick = () => { wrap.remove(); onYes(); };
  }

};

window.UI = UI;
