/* ===========================================
   EY LIVE — VOICE ROOM (room.js)
=========================================== */

const Room = (function () {

  const me = UI.requireAuth();
  if (!me) return {};

  const params = new URLSearchParams(location.search);
  const roomId = params.get("id");
  let room = DB.getRoom(roomId);

  if (!room) {
    document.body.innerHTML = `<div class="emptyState" style="padding-top:80px">Oda bulunamadı.<br><a href="home.html" style="color:var(--primary)">Ana sayfaya dön</a></div>`;
    return {};
  }

  function isHost() { return room.hostId === me.id; }
  function isMod() {
    return isHost() || (room.moderators || []).includes(me.id) || (room.admins || []).includes(me.id) || me.role === "admin";
  }
  function mySeat() { return room.mics.findIndex(m => m.userId === me.id); }

  function refresh() {
    room = DB.getRoom(roomId);
    renderInfo();
    renderMics();
    renderHands();
    renderChat();
  }

  function renderInfo() {
    const host = DB.getUser(room.hostId);
    document.getElementById("roomInfo").innerHTML = `
      <div class="rTitle">${UI.esc(room.name)} ${room.locked ? "🔒" : ""}</div>
      <div class="rSub">Lv.${room.level} · Host: ${host ? UI.esc(host.username) : "?"} · ${room.mics.filter(m => m.userId).length}/12</div>`;
    document.getElementById("settingsBtn").style.display = isMod() ? "flex" : "none";
  }

  function seatLabel(m) {
    if (m.locked) return { icon: "🔒", label: "Kilitli" };
    if (!m.userId) return { icon: "➕", label: "Boş" };
    const u = DB.getUser(m.userId);
    return { icon: u ? u.avatar : "🙂", label: u ? u.username : "?" };
  }

  function roleTagFor(userId) {
    if (userId === room.hostId) return "HOST";
    if ((room.coHost || []).includes(userId)) return "CO-HOST";
    if ((room.moderators || []).includes(userId)) return "MOD";
    return "";
  }

  function renderMics() {
    document.getElementById("micGrid").innerHTML = room.mics.map((m, i) => {
      const { icon, label } = seatLabel(m);
      const role = m.userId ? roleTagFor(m.userId) : "";
      const cls = ["micSeat"];
      if (m.userId) cls.push("filled");
      if (m.userId === room.hostId) cls.push("host");
      if (m.locked) cls.push("locked");
      return `
        <div class="${cls.join(" ")}" onclick="Room.tapSeat(${i})">
          <div class="seatCircle">
            ${icon}
            ${role ? `<span class="roleTag">${role}</span>` : ""}
            ${m.locked ? `<span class="lockTag">🔒</span>` : ""}
          </div>
          <div class="seatLabel">${UI.esc(label)}</div>
        </div>`;
    }).join("");
  }

  function renderHands() {
    const hands = room.handsRaised || [];
    document.getElementById("handRow").innerHTML = hands.map(uid => {
      const u = DB.getUser(uid);
      const action = isMod() ? `onclick="Room.approveHand('${uid}')"` : "";
      return `<div class="handChip" ${action}>✋ ${u ? UI.esc(u.username) : uid}${isMod() ? " · onayla" : ""}</div>`;
    }).join("");
  }

  function renderChat() {
    const box = document.getElementById("roomChat");
    box.innerHTML = room.chat.map(m => {
      if (m.type === "system") return `<div class="chatMsg sys">${UI.esc(m.text)}</div>`;
      const u = DB.getUser(m.userId);
      const cls = m.type === "gift" ? "chatMsg gift" : "chatMsg";
      return `<div class="${cls}"><span class="who">${u ? UI.esc(u.username) : "?"}:</span>${UI.esc(m.text)}</div>`;
    }).join("");
    box.scrollTop = box.scrollHeight;
  }

  function tapSeat(i) {
    const m = room.mics[i];
    if (m.userId === me.id) {
      UI.confirm("Mikrofondan inmek istiyor musun?", () => {
        DB.leaveMic(roomId, me.id);
        refresh();
      });
      return;
    }
    if (m.userId) {
      if (isMod()) openSeatManage(i, m);
      else UI.toast("Bu koltuk dolu");
      return;
    }
    if (m.locked) {
      if (isMod()) {
        UI.confirm("Bu mikrofonun kilidini açmak ister misin?", () => { DB.toggleMicLock(roomId, i); refresh(); });
      } else {
        UI.toast("Bu mikrofon kilitli 🔒", "error");
      }
      return;
    }
    const res = DB.sitOnMic(roomId, i, me.id);
    if (!res.ok) UI.toast(res.msg, "error");
    else { UI.toast("Mikrofona oturdun 🎤", "success"); refresh(); }
  }

  function openSeatManage(i, m) {
    const u = DB.getUser(m.userId);
    if (!u) return;
    const wrap = document.createElement("div");
    wrap.className = "modalOverlay";
    wrap.innerHTML = `
      <div class="modalBox">
        <div class="flexCenter" style="margin-bottom:14px">
          <div class="avatarCircle" style="width:44px;height:44px;font-size:22px">${u.avatar}</div>
          <div><b>${UI.esc(u.username)}</b><div class="muted">Koltuk ${i + 1}</div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn btnGhost" id="mkCoHost">🎙️ Co-Host Yap</button>
          <button class="btn btnGhost" id="mkMod">🛡️ Moderatör Yap</button>
          <button class="btn btnGhost" id="mkMute">🔇 ${m.muted ? "Sesi Aç" : "Sustur"}</button>
          <button class="btn btnGhost" id="mkKick">⬇️ Mikrofondan Düşür</button>
          <button class="btn btnGhost" id="mkLock">🔒 Koltuğu Kilitle</button>
          <button class="btn btnDanger" id="mkClose">Kapat</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    wrap.querySelector("#mkCoHost").onclick = () => { DB.setRoomRole(roomId, u.id, "cohost"); UI.toast("Co-Host yapıldı", "success"); wrap.remove(); refresh(); };
    wrap.querySelector("#mkMod").onclick = () => { DB.setRoomRole(roomId, u.id, "moderator"); UI.toast("Moderatör yapıldı", "success"); wrap.remove(); refresh(); };
    wrap.querySelector("#mkMute").onclick = () => { m.muted = !m.muted; DB.save(); wrap.remove(); refresh(); };
    wrap.querySelector("#mkKick").onclick = () => { DB.leaveMic(roomId, u.id); UI.toast("Mikrofondan düşürüldü"); wrap.remove(); refresh(); };
    wrap.querySelector("#mkLock").onclick = () => { DB.toggleMicLock(roomId, i); wrap.remove(); refresh(); };
    wrap.querySelector("#mkClose").onclick = () => wrap.remove();
  }

  function toggleHand() {
    const seat = mySeat();
    if (seat >= 0) { UI.toast("Zaten mikrofondasın"); return; }
    const hands = room.handsRaised || [];
    if (hands.includes(me.id)) {
      DB.lowerHand(roomId, me.id);
      UI.toast("El indirildi");
    } else {
      DB.raiseHand(roomId, me.id);
      UI.toast("El kaldırıldı ✋", "success");
    }
    refresh();
    document.getElementById("handBtn").classList.toggle("raised", (DB.getRoom(roomId).handsRaised || []).includes(me.id));
  }

  function approveHand(uid) {
    const free = room.mics.findIndex(m => !m.userId && !m.locked);
    if (free < 0) { UI.toast("Boş mikrofon yok", "error"); return; }
    DB.sitOnMic(roomId, free, uid);
    UI.toast("Kullanıcı mikrofona alındı", "success");
    refresh();
  }

  function sendChat() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();
    if (!text) return;
    DB.sendRoomMessage(roomId, me.id, text);
    input.value = "";
    refresh();
  }

  function openEmoji() {
    const emojis = ["😂","❤️","🔥","👏","😍","🎉","😢","😮","👍","🙏","💯","😅","🥳","😴","🤔","😡","🎶","✨","👑","💎","🚀","🎁","💪","🤝"];
    const sheet = openSheet(`
      <div class="sectionTitle"><span>Emoji Gönder</span></div>
      <div class="emojiGrid">${emojis.map(e => `<button onclick="Room.sendEmoji('${e}')">${e}</button>`).join("")}</div>
    `);
  }

  function sendEmoji(e) {
    DB.sendRoomMessage(roomId, me.id, e, "emoji");
    closeSheet();
    refresh();
  }

  function openGifts() {
    const gifts = DB.allGifts();
    const seated = room.mics.filter(m => m.userId).map(m => DB.getUser(m.userId));
    openSheet(`
      <div class="sectionTitle"><span>🎁 Hediye Gönder</span></div>
      <p class="muted" style="margin-bottom:10px">Bakiyen: 💰 ${me.coin}</p>
      <div class="giftGrid" id="giftGrid">
        ${gifts.map(g => `<div class="giftItem" data-g="${g.id}" onclick="Room.pickGift('${g.id}')">
          <div class="gIcon">${g.icon}</div><div class="gName">${g.name}</div><div class="gPrice">💰${g.price}</div>
        </div>`).join("")}
      </div>
      <div class="sectionTitle" style="margin-top:16px"><span>Alıcı Seç</span></div>
      <div class="scrollRow" id="giftTargets">
        ${seated.length ? seated.map(u => `<div class="pill" data-u="${u.id}" onclick="Room.pickTarget('${u.id}')">${u.avatar} ${UI.esc(u.username)}</div>`).join("") : `<span class="muted">Mikrofonda kimse yok</span>`}
      </div>
      <button class="btn btnPrimary btnBlock" style="margin-top:16px" onclick="Room.confirmGift()">Gönder</button>
    `);
  }

  let _giftSel = null, _targetSel = null;
  function pickGift(id) {
    _giftSel = id;
    document.querySelectorAll("#giftGrid .giftItem").forEach(el => el.classList.toggle("selected", el.dataset.g === id));
  }
  function pickTarget(id) {
    _targetSel = id;
    document.querySelectorAll("#giftTargets .pill").forEach(el => el.classList.toggle("active", el.dataset.u === id));
  }
  function confirmGift() {
    if (!_giftSel || !_targetSel) { UI.toast("Hediye ve alıcı seç", "error"); return; }
    const res = DB.sendGift(me.id, _targetSel, _giftSel, roomId);
    if (!res.ok) { UI.toast(res.msg, "error"); return; }
    UI.toast("Hediye gönderildi! 🎁", "success");
    closeSheet();
    refresh();
  }

  function openRules() {
    const editable = isMod();
    openSheet(`
      <div class="sectionTitle"><span>📜 Oda Kuralları</span></div>
      <textarea class="input" id="rulesArea" rows="6" ${editable ? "" : "readonly"} style="resize:vertical">${UI.esc(room.rules || "")}</textarea>
      ${editable ? `<button class="btn btnPrimary btnBlock" onclick="Room.saveRules()">Kaydet</button>` : ""}
    `);
  }
  function saveRules() {
    const text = document.getElementById("rulesArea").value;
    DB.updateRoom(roomId, { rules: text });
    UI.toast("Kurallar güncellendi", "success");
    closeSheet();
    refresh();
  }

  function openManage() {
    if (!isMod()) return;
    openSheet(`
      <div class="sectionTitle"><span>⚙️ Oda Yönetimi</span></div>
      <div class="manageRow"><span>Oda Seviyesi</span><b>Lv.${room.level}</b></div>
      <div class="manageRow"><span>Oda Kilidi</span>
        <button class="btn btnGhost btnSm" onclick="Room.toggleRoomLock()">${room.locked ? "🔓 Kilidi Aç" : "🔒 Kilitle"}</button>
      </div>
      <div class="manageRow"><span>Yöneticiler</span>
        <span class="muted">${(room.admins || []).map(id => DB.getUser(id)?.username).filter(Boolean).join(", ") || "yok"}</span>
      </div>
      <div class="sectionTitle" style="margin-top:14px"><span>Oda Adını Değiştir</span></div>
      <input class="input" id="renameRoom" value="${UI.esc(room.name)}">
      <button class="btn btnPrimary btnBlock" onclick="Room.renameRoom()">Kaydet</button>
    `);
  }
  function toggleRoomLock() {
    DB.updateRoom(roomId, { locked: !room.locked });
    UI.toast("Oda durumu güncellendi", "success");
    closeSheet();
    refresh();
  }
  function renameRoom() {
    const v = document.getElementById("renameRoom").value.trim();
    if (!v) return;
    DB.updateRoom(roomId, { name: v });
    UI.toast("Oda adı güncellendi", "success");
    closeSheet();
    refresh();
  }

  function openSheet(html) {
    closeSheet();
    const overlay = document.createElement("div");
    overlay.className = "modalOverlay";
    overlay.id = "roomSheetOverlay";
    overlay.innerHTML = `<div class="sheetBox">${html}</div>`;
    overlay.onclick = (e) => { if (e.target === overlay) closeSheet(); };
    document.body.appendChild(overlay);
    return overlay;
  }
  function closeSheet() {
    const el = document.getElementById("roomSheetOverlay");
    if (el) el.remove();
  }

  function leave() {
    DB.leaveMic(roomId, me.id);
    DB.lowerHand(roomId, me.id);
    window.location.href = "home.html";
  }

  document.getElementById("chatInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChat();
  });

  refresh();
  setInterval(refresh, 4000);

  return {
    tapSeat, toggleHand, approveHand, sendChat, openEmoji, sendEmoji,
    openGifts, pickGift, pickTarget, confirmGift, openRules, saveRules,
    openManage, toggleRoomLock, renameRoom, leave
  };

})();
