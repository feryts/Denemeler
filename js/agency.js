/* ===========================================
   EY LIVE — AGENCY PANEL (agency.js)
=========================================== */

(function () {
  const me0 = UI.requireAuth();
  if (!me0) return;

  document.getElementById("navHost").innerHTML = UI.bottomNav("profile");

  function me() { return DB.getUser(me0.id); }

  function render() {
    const u = me();
    const myAgency = DB.agencyByOwner(u.id);
    if (myAgency) renderOwnerPanel(myAgency);
    else renderBrowse(u);
  }

  function renderBrowse(u) {
    const agencies = DB.load().agencies;
    document.getElementById("agencyPage").innerHTML = `
      ${UI.topBar("Ajanslar", { back: true })}
      ${u.agencyId ? `<div class="card" style="margin-bottom:14px">✅ Şu anda <b>${UI.esc(DB.getAgency(u.agencyId)?.name)}</b> ajansına bağlısın.</div>` : ""}
      <div class="sectionTitle"><span>Mevcut Ajanslar</span></div>
      ${agencies.map(a => {
        const applied = a.applications.find(x => x.userId === u.id);
        return `
        <div class="card" style="margin-bottom:10px">
          <div class="flexBetween">
            <div><b>${UI.esc(a.name)}</b><div class="muted">${a.streamers.length} yayıncı</div></div>
            ${u.agencyId === a.id
              ? `<span class="pill active">Üyesisin</span>`
              : applied
                ? `<span class="pill">${applied.status === "pending" ? "Beklemede" : applied.status === "approved" ? "Onaylandı" : "Reddedildi"}</span>`
                : `<button class="btn btnPrimary btnSm" onclick="AgencyPanel.apply('${a.id}')">Başvur</button>`}
          </div>
        </div>`;
      }).join("")}
    `;
  }

  function renderOwnerPanel(a) {
    const pending = a.applications.filter(x => x.status === "pending");
    document.getElementById("agencyPage").innerHTML = `
      ${UI.topBar(a.name, { back: true })}

      <div class="statGrid">
        <div class="statCard"><div class="v">${a.streamers.length}</div><div class="l">Yayıncı</div></div>
        <div class="statCard"><div class="v">💰 ${a.earnings}</div><div class="l">Toplam Kazanç</div></div>
        <div class="statCard"><div class="v">${pending.length}</div><div class="l">Bekleyen Başvuru</div></div>
        <div class="statCard"><div class="v">${a.announcements.length}</div><div class="l">Duyuru</div></div>
      </div>

      <div class="sectionTitle"><span>📥 Başvurular</span></div>
      ${pending.length ? pending.map(app => {
        const u = DB.getUser(app.userId);
        return `
        <div class="agListRow">
          <div class="avatarCircle" style="width:36px;height:36px;font-size:18px">${u ? u.avatar : "?"}</div>
          <div class="name">${u ? UI.esc(u.username) : "?"}</div>
          <button class="btn btnSuccess btnSm" onclick="AgencyPanel.review('${app.userId}', true)">✔️</button>
          <button class="btn btnDanger btnSm" onclick="AgencyPanel.review('${app.userId}', false)">✖️</button>
        </div>`;
      }).join("") : `<p class="muted">Bekleyen başvuru yok</p>`}

      <div class="sectionTitle"><span>🎤 Yayıncı Listesi & Performans</span></div>
      ${a.streamers.length ? a.streamers.map(uid => {
        const u = DB.getUser(uid);
        if (!u) return "";
        const perf = Math.min(100, Math.round((u.diamond / 5000) * 100));
        return `
        <div class="card" style="margin-bottom:10px">
          <div class="agListRow" style="border-bottom:none;padding:0 0 6px 0">
            <div class="avatarCircle" style="width:36px;height:36px;font-size:18px">${u.avatar}</div>
            <div class="name">${UI.esc(u.username)} ${UI.vipBadge(u.vip)}</div>
            <button class="btn btnDanger btnSm" onclick="AgencyPanel.remove('${u.id}')">Çıkar</button>
          </div>
          <div class="muted">💎 ${u.diamond} kazanç · Seviye ${u.level}</div>
          <div class="perfBar"><div class="fill" style="width:${perf}%"></div></div>
        </div>`;
      }).join("") : `<p class="muted">Henüz yayıncı yok</p>`}

      <div class="sectionTitle"><span>📢 Duyuru Gönder</span></div>
      <div class="card">
        <textarea class="input" id="agAnnounce" rows="3" placeholder="Yayıncılarına duyuru yaz..."></textarea>
        <button class="btn btnPrimary btnBlock" onclick="AgencyPanel.announce()">Gönder</button>
      </div>

      <div class="sectionTitle"><span>📜 Geçmiş Duyurular</span></div>
      ${a.announcements.map(an => `
        <div class="card" style="margin-bottom:8px">
          <div>${UI.esc(an.text)}</div><div class="muted" style="margin-top:4px">${UI.timeAgo(an.ts)}</div>
        </div>`).join("") || `<p class="muted">Yok</p>`}
    `;
  }

  window.AgencyPanel = {
    apply(agencyId) {
      DB.applyToAgency(agencyId, me0.id);
      UI.toast("Başvurun gönderildi!", "success");
      render();
    },
    review(userId, approve) {
      const a = DB.agencyByOwner(me0.id);
      DB.reviewApplication(a.id, userId, approve);
      UI.toast(approve ? "Başvuru onaylandı" : "Başvuru reddedildi", approve ? "success" : "error");
      render();
    },
    remove(userId) {
      const a = DB.agencyByOwner(me0.id);
      UI.confirm("Bu yayıncıyı ajanstan çıkarmak istiyor musun?", () => {
        DB.removeStreamer(a.id, userId);
        UI.toast("Yayıncı çıkarıldı", "success");
        render();
      });
    },
    announce() {
      const text = document.getElementById("agAnnounce").value.trim();
      if (!text) return;
      const a = DB.agencyByOwner(me0.id);
      DB.agencyAnnounce(a.id, text);
      UI.toast("Duyuru gönderildi", "success");
      render();
    }
  };

  render();
})();
