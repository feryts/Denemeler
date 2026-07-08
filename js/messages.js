/* ===========================================
   EY LIVE — MESSAGES (messages.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  document.getElementById("navHost").innerHTML = UI.bottomNav("messages");

  const params = new URLSearchParams(location.search);
  const withId = params.get("with");
  let tab = params.get("tab") === "notif" ? "notif" : "chats";

  if (withId) {
    renderChatDetail(withId);
  } else {
    renderList();
  }

  function renderList() {
    document.getElementById("msgPage").innerHTML = `
      ${UI.topBar("Mesaj")}
      <div class="quickIconsRow">
        <div class="quickIcon" onclick="UI.toast('Kullanıcı ekleme yakında')"><div class="qBox">➕</div><div class="qLabel">Uygula</div></div>
        <div class="quickIcon" onclick="UI.toast('Aktivite akışı yakında')"><div class="qBox">📣</div><div class="qLabel">Aktivite</div></div>
        <div class="quickIcon" id="qNotif"><div class="qBox">🔔</div><div class="qLabel">Bildirim</div></div>
        <div class="quickIcon" onclick="UI.toast('Ziyaretçi listesi yakında')"><div class="qBox">👤</div><div class="qLabel">Ziyaretçiler</div></div>
      </div>
      <div class="msgTabs">
        <button class="pill ${tab === "chats" ? "active" : ""}" id="tabChats">💬 Sohbetler</button>
        <button class="pill ${tab === "notif" ? "active" : ""}" id="tabNotif">🔔 Bildirimler</button>
      </div>
      <div id="listBody"></div>
    `;
    document.getElementById("qNotif").onclick = () => { tab = "notif"; renderList(); };
    document.getElementById("tabChats").onclick = () => { tab = "chats"; renderList(); };
    document.getElementById("tabNotif").onclick = () => { tab = "notif"; renderList(); };
    tab === "chats" ? renderChats() : renderNotifs();
  }

  function renderChats() {
    const convos = DB.userConversations(me.id).map(c => {
      const otherId = c.participants.find(p => p !== me.id);
      const other = DB.getUser(otherId);
      const last = c.messages[c.messages.length - 1];
      const unread = c.messages.filter(m => m.from !== me.id && !m.read).length;
      return { c, other, last, unread };
    }).filter(x => x.other).sort((a, b) => (b.last?.ts || 0) - (a.last?.ts || 0));

    document.getElementById("listBody").innerHTML = `
      <div class="sectionTitle"><span>📢 Sistem Duyuruları</span></div>
      ${DB.load().announcements.slice(0, 2).map(a => `
        <div class="notifRow"><div class="nIcon">📢</div>
          <div><div class="nTxt"><b>${UI.esc(a.title)}</b><span class="officialTag">resmi</span><br>${UI.esc(a.text)}</div>
          <div class="nTime">${UI.timeAgo(a.ts)}</div></div>
        </div>`).join("")}

      <div class="sectionTitle"><span>Özel Sohbetler</span></div>
      ${convos.length ? convos.map(({ other, last, unread }) => `
        <a href="messages.html?with=${other.id}" class="convoRow">
          <div class="avatarCircle" style="width:46px;height:46px;font-size:22px">${other.avatar}${other.online ? '<span class="dot"></span>' : ""}</div>
          <div style="flex:1;min-width:0">
            <div class="cName">${UI.esc(other.username)}${other.vip ? `<span class="vipTagSm">VIP${other.vip}</span>` : ""}</div>
            <div class="cLast">${last ? UI.esc(last.text) : "Henüz mesaj yok"}</div>
          </div>
          ${unread ? `<span class="badgeDot" style="position:static">${unread}</span>` : ""}
          <span class="cTime">${last ? UI.timeAgo(last.ts) : ""}</span>
        </a>`).join("") : `<div class="emptyState">Henüz sohbetin yok.<br>Bir kullanıcının profiline gidip mesaj gönderebilirsin.</div>`}
    `;
  }

  function renderNotifs() {
    const notifs = DB.userNotifications(me.id);
    document.getElementById("listBody").innerHTML = notifs.length ? notifs.map(n => {
      const icons = { system: "🔔", agency: "🏢", gift: "🎁", follow: "➕" };
      return `
      <div class="notifRow ${n.read ? "" : "unread"}" onclick="DB.markNotifRead('${n.id}')">
        <div class="nIcon">${icons[n.type] || "🔔"}</div>
        <div><div class="nTxt">${UI.esc(n.text)}</div><div class="nTime">${UI.timeAgo(n.ts)}</div></div>
      </div>`;
    }).join("") : `<div class="emptyState">Bildirim yok</div>`;
  }

  function renderChatDetail(otherId) {
    const other = DB.getUser(otherId);
    if (!other) { document.getElementById("msgPage").innerHTML = `<div class="emptyState">Kullanıcı bulunamadı</div>`; return; }
    const convo = DB.getConversation(me.id, otherId);
    DB.markConversationRead(convo.id, me.id);

    document.getElementById("msgPage").innerHTML = `
      <div class="chatDetail">
        ${UI.topBar(other.username + (other.online ? " 🟢" : " ⚪"), { back: true })}
        <div class="chatMsgsBox" id="chatMsgsBox">
          ${convo.messages.map(m => `<div class="bubble ${m.from === me.id ? "me" : "them"}">${UI.esc(m.text)}</div>`).join("") || `<div class="emptyState">Sohbete başla!</div>`}
        </div>
        <div class="chatSendRow">
          <input class="input" id="chatMsgInput" placeholder="Mesaj yaz..." style="margin-bottom:0;flex:1">
          <button class="btn btnPrimary" onclick="sendPM()">Gönder</button>
        </div>
      </div>
    `;
    const box = document.getElementById("chatMsgsBox");
    box.scrollTop = box.scrollHeight;

    window.sendPM = () => {
      const input = document.getElementById("chatMsgInput");
      const text = input.value.trim();
      if (!text) return;
      DB.sendMessage(me.id, otherId, text);
      input.value = "";
      renderChatDetail(otherId);
    };

    document.getElementById("chatMsgInput").addEventListener("keydown", e => {
      if (e.key === "Enter") window.sendPM();
    });
  }

})();
