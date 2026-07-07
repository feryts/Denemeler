/* ===========================================
   EY LIVE — PROFILE (profile.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  document.getElementById("navHost").innerHTML = UI.bottomNav("profile");

  const params = new URLSearchParams(location.search);
  const viewId = params.get("id") || me.id;
  const isMe = viewId === me.id;
  const user = DB.getUser(viewId);

  if (!user) {
    document.getElementById("profilePage").innerHTML = `<div class="emptyState">Kullanıcı bulunamadı</div>`;
    return;
  }

  const avatars = ["🙂","😎","🥳","🦄","🐱","🐶","🦊","🐼","👩","👨","🧑‍🎤","🧑‍🚀","👽","🤖","🌸","🔥","🎤","👑"];

  function agencyInfoHtml() {
    if (!user.agencyId) return `<div class="infoRow"><span>Ajans</span><span class="muted">Bağlı değil</span></div>`;
    const a = DB.getAgency(user.agencyId);
    return `<div class="infoRow"><span>Ajans</span><span>${a ? UI.esc(a.name) : "?"}</span></div>`;
  }

  function streamerStatus() {
    const map = { streamer: "🎤 Aktif Yayıncı", agency: "🏢 Ajans Sahibi", admin: "👑 Yönetici", user: "Standart Üye", guest: "Misafir" };
    return map[user.role] || "Üye";
  }

  function render() {
    const isFollowing = DB.getUser(me.id).following.includes(user.id);
    document.getElementById("profilePage").innerHTML = `
      ${UI.topBar(isMe ? "Profilim" : user.username, { back: !isMe, right: isMe ? `<button class="topBtn" onclick="Profile.logout()">🚪</button>` : "" })}

      <div class="coverBox" style="${user.cover ? `background-image:url('${user.cover}');background-size:cover` : ""}">
        ${isMe ? `<button class="editCoverBtn" onclick="Profile.editCover()">✏️ Kapak</button>` : ""}
        <div class="profileAvatarWrap">
          <div class="avatarCircle">${user.avatar}</div>
        </div>
      </div>

      <div class="pName">${UI.esc(user.username)} ${UI.vipBadge(user.vip)} ${user.verified ? "✅" : ""}</div>
      <div class="pIdRow">
        ID: ${user.id} <button onclick="Profile.copyId()">Kopyala 📋</button>
        ${isMe ? `<button onclick="Profile.editAvatar()">Avatarı Değiştir</button>` : ""}
      </div>

      <div class="statsRow">
        <div class="statBox"><div class="v">${user.level}</div><div class="l">Seviye</div></div>
        <div class="statBox"><div class="v">💰${user.coin}</div><div class="l">Coin</div></div>
        <div class="statBox"><div class="v">💎${user.diamond}</div><div class="l">Diamond</div></div>
        <div class="statBox"><div class="v">${user.vip}</div><div class="l">VIP</div></div>
      </div>

      <div class="statsRow" style="grid-template-columns:1fr 1fr">
        <div class="statBox" onclick="Profile.showList('followers')" style="cursor:pointer">
          <div class="v">${user.followers.length}</div><div class="l">Takipçi</div>
        </div>
        <div class="statBox" onclick="Profile.showList('following')" style="cursor:pointer">
          <div class="v">${user.following.length}</div><div class="l">Takip Edilen</div>
        </div>
      </div>

      ${!isMe ? `
        <div class="grid2" style="margin:12px 0">
          <button class="btn ${isFollowing ? "btnGhost" : "btnPrimary"}" onclick="Profile.follow()">${isFollowing ? "Takipten Çık" : "➕ Takip Et"}</button>
          <button class="btn btnGhost" onclick="Profile.message()">💬 Mesaj Gönder</button>
        </div>
      ` : ""}

      <div class="sectionTitle"><span>Hakkımda</span></div>
      <div class="card">
        <div class="aboutBox" id="aboutTxt">${UI.esc(user.about || "Henüz bir şey yazmadı.")}</div>
        ${isMe ? `<button class="btn btnGhost btnSm" onclick="Profile.editAbout()">✏️ Düzenle</button>` : ""}
      </div>

      <div class="sectionTitle"><span>Bilgiler</span></div>
      <div class="card">
        <div class="infoRow"><span>Durum</span><span>${streamerStatus()}</span></div>
        ${agencyInfoHtml()}
        <div class="infoRow"><span>Cinsiyet</span><span>${UI.esc(user.gender || "-")}</span></div>
        <div class="infoRow"><span>Katılma</span><span>${new Date(user.createdAt).toLocaleDateString("tr-TR")}</span></div>
      </div>

      ${isMe && (user.role === "agency") ? `<button class="btn btnPrimary btnBlock" style="margin-top:14px" onclick="location.href='agency.html'">🏢 Ajans Panelim</button>` : ""}
      ${isMe && user.role !== "agency" && !user.agencyId ? `<button class="btn btnGhost btnBlock" style="margin-top:14px" onclick="location.href='agency.html'">🏢 Ajanslara Başvur</button>` : ""}
      ${isMe && user.role === "admin" ? `<button class="btn btnDanger btnBlock" style="margin-top:14px" onclick="location.href='admin.html'">🛠️ Admin Panel</button>` : ""}
    `;
  }

  window.Profile = {
    copyId() {
      navigator.clipboard?.writeText(user.id).catch(() => {});
      UI.toast("ID kopyalandı: " + user.id, "success");
    },
    editAvatar() {
      const sheet = document.createElement("div");
      sheet.className = "modalOverlay";
      sheet.innerHTML = `<div class="sheetBox">
        <div class="sectionTitle"><span>Avatar Seç</span></div>
        <div class="avatarPicker">${avatars.map(a => `<div class="avatarOpt" onclick="Profile.setAvatar('${a}')">${a}</div>`).join("")}</div>
      </div>`;
      sheet.onclick = e => { if (e.target === sheet) sheet.remove(); };
      document.body.appendChild(sheet);
    },
    setAvatar(a) {
      DB.updateUser(me.id, { avatar: a });
      document.querySelector(".modalOverlay")?.remove();
      UI.toast("Avatar güncellendi", "success");
      location.reload();
    },
    editCover() {
      const url = prompt("Kapak fotoğrafı için bir görsel URL'si yapıştır (demo):", user.cover || "");
      if (url !== null) { DB.updateUser(me.id, { cover: url }); location.reload(); }
    },
    editAbout() {
      const val = prompt("Hakkımda:", user.about || "");
      if (val !== null) { DB.updateUser(me.id, { about: val }); UI.toast("Güncellendi", "success"); location.reload(); }
    },
    follow() {
      DB.toggleFollow(me.id, user.id);
      render();
    },
    message() { location.href = "messages.html?with=" + user.id; },
    showList(type) {
      const ids = user[type];
      const users = ids.map(id => DB.getUser(id)).filter(Boolean);
      const sheet = document.createElement("div");
      sheet.className = "modalOverlay";
      sheet.innerHTML = `<div class="sheetBox">
        <div class="sectionTitle"><span>${type === "followers" ? "Takipçiler" : "Takip Edilenler"}</span></div>
        ${users.length ? users.map(u => `
          <a href="profile.html?id=${u.id}" class="flexCenter" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)">
            <div class="avatarCircle" style="width:38px;height:38px;font-size:18px">${u.avatar}</div>
            <span>${UI.esc(u.username)}</span>
          </a>`).join("") : `<p class="muted">Liste boş</p>`}
      </div>`;
      sheet.onclick = e => { if (e.target === sheet) sheet.remove(); };
      document.body.appendChild(sheet);
    },
    logout() { UI.confirm("Çıkış yapmak istiyor musun?", () => UI.logout()); }
  };

  render();
})();
