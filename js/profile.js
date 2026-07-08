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

  function ageFromBirth(b) {
    if (!b) return null;
    const d = new Date(b);
    if (isNaN(d)) return null;
    const diff = Date.now() - d.getTime();
    return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
  }

  function render() {
    if (isMe) return renderMe();
    return renderOther();
  }

  function renderMe() {
    const age = ageFromBirth(user.birthdate);
    const genderIcon = user.gender === "kadın" ? "♀" : user.gender === "erkek" ? "♂" : "⚧";
    document.getElementById("profilePage").innerHTML = `
      ${UI.topBar("Profilim", { right: `<button class="topBtn" onclick="Profile.logout()">🚪</button>` })}

      <div class="coverBox" style="${user.cover ? `background-image:url('${user.cover}');background-size:cover` : ""}">
        <button class="editCoverBtn" onclick="Profile.editCover()">✏️ Kapak</button>
        <div class="profileAvatarWrap">
          <div class="avatarCircle" onclick="Profile.editAvatar()">${user.avatar}</div>
        </div>
      </div>

      <div class="pName">${UI.esc(user.username)} ${user.verified ? "✅" : ""}</div>
      <div class="pMetaRow">
        ${age ? `<span class="genderPill">${genderIcon} ${age}</span>` : ""}
        <span class="vipPill2">VIP${user.vip}</span>
        <span class="miscPill">⚙️ ${user.level}</span>
        <span class="miscPill">❤️ ${user.followers.length}</span>
      </div>
      <div class="pIdRow">ID:${user.id} <button onclick="Profile.copyId()">📋</button></div>

      <div class="bigStatsRow">
        <div onclick="Profile.showList('following')" style="cursor:pointer"><div class="v">${user.following.length}</div><div class="l">Arkadaşlar</div></div>
        <div onclick="Profile.showList('following')" style="cursor:pointer"><div class="v">${user.following.length}</div><div class="l">Takip ettim</div></div>
        <div onclick="Profile.showList('followers')" style="cursor:pointer"><div class="v">${user.followers.length}</div><div class="l">Fanlar</div></div>
      </div>

      <div class="coinCardsRow">
        <a href="wallet.html" class="coinCard2"><span class="cIcon">🟡</span><div><div class="cVal">${user.coin}</div><div class="cLabel">Xcoins</div></div></a>
        <a href="wallet.html" class="coinCard2"><span class="cIcon">💎</span><div><div class="cVal">${user.diamond}</div><div class="cLabel">Diamonds</div></div></a>
      </div>

      ${user.role === "agency" ? `
        <a href="agency.html" class="agencyCenterRow">
          <span class="acIcon">🛡️</span>
          <div><div class="acTitle">Ajans merkezi</div><div class="acSub">Acente yönetimi ve gelir detayı</div></div>
          <span class="acArrow">›</span>
        </a>` : `
        <a href="agency.html" class="agencyCenterRow">
          <span class="acIcon">🛡️</span>
          <div><div class="acTitle">Ajans merkezi</div><div class="acSub">${user.agencyId ? "Ajans bilgilerini görüntüle" : "Bir ajansa başvur"}</div></div>
          <span class="acArrow">›</span>
        </a>`}

      <div class="menuGrid">
        <a href="wallet.html" class="menuIcon"><div class="miBox">👑</div><div class="miLabel">VIP Merkezi</div></a>
        <div class="menuIcon" onclick="UI.toast('Noble sistemi yakında')"><div class="miBox">🔰</div><div class="miLabel">Noble</div></div>
        <div class="menuIcon" onclick="Profile.showLevel()"><div class="miBox">📶</div><div class="miLabel">Seviye</div></div>
        <div class="menuIcon" onclick="Profile.showList('following')"><div class="miBox">👥</div><div class="miLabel">Grup</div></div>
        <div class="menuIcon" onclick="Profile.showList('followers')"><div class="miBox">💗</div><div class="miLabel">İlişki</div></div>
        <a href="wallet.html" class="menuIcon"><div class="miBox">🛍️</div><div class="miLabel">Mağaza</div></a>
        <div class="menuIcon" onclick="UI.toast('Sırt çantası yakında')"><div class="miBox">🎒</div><div class="miLabel">Sırt çantası</div></div>
        <a href="games.html" class="menuIcon"><div class="miBox">🎮</div><div class="miLabel">Oyun Merkezi</div></a>
      </div>

      <div class="sectionTitle"><span>Hakkımda</span></div>
      <div class="card" style="margin-bottom:14px">
        <div class="aboutBox">${UI.esc(user.about || "Henüz bir şey yazmadı.")}</div>
        <button class="btn btnGhost btnSm" onclick="Profile.editAbout()">✏️ Düzenle</button>
      </div>

      <div class="myRoomRow" onclick="Profile.myRoom()">
        <span>🏠</span><b>Benim odam</b><span class="mrArrow">›</span>
      </div>

      ${user.role === "admin" ? `<button class="btn btnDanger btnBlock" style="margin-top:6px" onclick="location.href='admin.html'">🛠️ Admin Panel</button>` : ""}
    `;
  }

  function renderOther() {
    const isFollowing = DB.getUser(me.id).following.includes(user.id);
    document.getElementById("profilePage").innerHTML = `
      ${UI.topBar(user.username, { back: true })}

      <div class="coverBox" style="${user.cover ? `background-image:url('${user.cover}');background-size:cover` : ""}">
        <div class="profileAvatarWrap"><div class="avatarCircle">${user.avatar}</div></div>
      </div>

      <div class="pName">${UI.esc(user.username)} ${UI.vipBadge(user.vip)} ${user.verified ? "✅" : ""}</div>
      <div class="pIdRow">ID: ${user.id} <button onclick="Profile.copyId()">Kopyala 📋</button></div>

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

      <div class="grid2" style="margin:12px 0">
        <button class="btn ${isFollowing ? "btnGhost" : "btnPrimary"}" onclick="Profile.follow()">${isFollowing ? "Takipten Çık" : "➕ Takip Et"}</button>
        <button class="btn btnGhost" onclick="Profile.message()">💬 Mesaj Gönder</button>
      </div>

      <div class="sectionTitle"><span>Hakkımda</span></div>
      <div class="card">
        <div class="aboutBox">${UI.esc(user.about || "Henüz bir şey yazmadı.")}</div>
      </div>

      <div class="sectionTitle"><span>Bilgiler</span></div>
      <div class="card">
        <div class="infoRow"><span>Durum</span><span>${streamerStatus()}</span></div>
        ${agencyInfoHtml()}
        <div class="infoRow"><span>Cinsiyet</span><span>${UI.esc(user.gender || "-")}</span></div>
        <div class="infoRow"><span>Katılma</span><span>${new Date(user.createdAt).toLocaleDateString("tr-TR")}</span></div>
      </div>
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
    logout() { UI.confirm("Çıkış yapmak istiyor musun?", () => UI.logout()); },
    showLevel() {
      UI.toast(`Seviye ${user.level} · Sonraki seviyeye ${100 - (user.exp % 100)} XP kaldı`, "info");
    },
    myRoom() {
      const myRoom = DB.allRooms().find(r => r.hostId === user.id);
      if (myRoom) { location.href = "room.html?id=" + myRoom.id; return; }
      UI.confirm("Henüz bir oda kurmadın. Şimdi yeni bir oda kurmak ister misin?", () => {
        const room = DB.createRoom({
          name: user.username + "'in Odası", cover: "🎤", category: "Sohbet",
          hostId: user.id, tags: ["yeni"]
        });
        DB.sitOnMic(room.id, 0, user.id);
        location.href = "room.html?id=" + room.id;
      });
    }
  };

  render();
})();
