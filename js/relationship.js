/* ===========================================
   EY LIVE — İLİŞKİ (relationship.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  function render() {
    const u = DB.getUser(me.id);
    const partner = u.partnerId ? DB.getUser(u.partnerId) : null;

    document.getElementById("relPage").innerHTML = `
      ${UI.topBar("İlişki", { back: true, right: `<span class="flexCenter" style="gap:10px"><button class="topBtn">🏆</button><button class="topBtn">⋯</button></span>` })}

      ${partner ? `
        <div class="relCard">
          <div style="position:relative">
            <span class="pill" style="position:absolute;top:-10px;left:-6px;background:#ffd76a;color:#201200;font-weight:800">NEW</span>
            <div class="avatarCircle">${partner.avatar}</div>
          </div>
          <div>
            <div style="font-weight:800">${UI.esc(partner.username)}</div>
            <div class="muted">Bağ seviyesi: ${u.relationshipExp || 0} EXP</div>
          </div>
          <div class="fire">🔥</div>
          <div class="plusBtn" onclick="RelPage.showInvite()">＋<div style="font-size:9px;margin-top:2px">İnşa etmek</div></div>
        </div>
      ` : ""}

      <div class="sectionTitle" style="justify-content:center"><span>✦ Tüm ilişkiler ✦</span></div>

      <div class="relBuildBox" onclick="RelPage.showInvite()">
        <div class="plusBtn">＋</div>
        İnşa etmek
      </div>

      <button class="ctaBtn btnBlock" style="border:none;width:100%" onclick="RelPage.showInvite()">＋ Yeni ilişki kurun</button>
    `;
  }

  window.RelPage = {
    showInvite() {
      const me2 = DB.getUser(me.id);
      const candidates = DB.allUsers().filter(x => x.id !== me.id && !x.partnerId);
      const sheet = document.createElement("div");
      sheet.className = "modalOverlay";
      sheet.innerHTML = `<div class="sheetBox">
        <div class="sectionTitle"><span>İlişki kurmak istediğin kişiyi seç</span></div>
        ${candidates.length ? candidates.map(c => `
          <div class="flexCenter" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);cursor:pointer" onclick="RelPage.propose('${c.id}')">
            <div class="avatarCircle" style="width:38px;height:38px;font-size:18px">${c.avatar}</div>
            <span>${UI.esc(c.username)}</span>
          </div>`).join("") : `<p class="muted">Uygun kullanıcı yok</p>`}
      </div>`;
      sheet.onclick = e => { if (e.target === sheet) sheet.remove(); };
      document.body.appendChild(sheet);
    },
    propose(targetId) {
      const res = DB.setPartner(me.id, targetId);
      document.querySelector(".modalOverlay")?.remove();
      if (!res.ok) { UI.toast(res.msg, "error"); return; }
      UI.toast("İlişki kuruldu 💗", "success");
      render();
    }
  };

  render();
})();
