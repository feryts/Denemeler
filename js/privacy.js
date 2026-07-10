/* ===========================================
   EY LIVE — GİZLİLİK (privacy.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  const toggles = [
    { key: "waNotif", label: "WhatsApp bildirimlerini açın", hint: "WhatsApp'ta istediğiniz zaman STOP yazarak abonelikten çıkabilirsiniz.", needVip: 0, always: true },
    { key: "hideCountry", label: "Ülkeyi gizle", hint: "Profil sayfasında, ülkeniz “bilinmeyen ülke” olarak görünecek (VIP8'in ayrıcalıkları)", needVip: 8 },
    { key: "hideLastSeen", label: "Son çevrimiçiyi gizle", hint: "Etkinleştirildiğinde, profil sayfanızdaki Son Çevrimiçi gizlenecektir (VIP2'ye özel ayrıcalık)", needVip: 2 },
    { key: "msgSync", label: "Mesajlar dolaşım özelliği", hint: "Mesajlarınızı buluta kaydedebilir ve başka cihazlarda görüntüleyebilirsiniz.", needVip: 0, always: true, link: true },
    { key: "hideCharm", label: "Charm seviyesini gizle", hint: "Etkinleştirildiğinde, çekicilik seviyeniz tüm sayfalardan kaybolacaktır (VIP10 özel ayrıcalığı).", needVip: 10 },
    { key: "hidePublisherMark", label: "Yayıncı İşaretini Gizle", hint: "Etkinleştirildiğinde, yayıncı işaretiniz profilinizde ve mini kartınızda kaybolacaktır (VIP9'a özel ayrıcalık).", needVip: 9 },
    { key: "hideVisitHistory", label: "Görüntüleme geçmişini gizle", hint: "Etkinleştirildiğinde, kimi ziyaret ettiğiniz gizlenecektir.", needVip: 5 }
  ];

  function render() {
    const u = DB.getUser(me.id);
    const priv = u.privacy || {};

    document.getElementById("privacyPage").innerHTML = `
      ${UI.topBar("Gizlilik", { back: true })}

      ${toggles.map(t => {
        const on = t.always ? (priv[t.key] !== false) : !!priv[t.key];
        return `
        <div class="settRow">
          <span class="rTitle">${t.label}</span>
          <div class="toggle ${on ? "on" : ""}" onclick="PrivacyPage.toggle('${t.key}', ${t.needVip})"></div>
        </div>
        <p class="settHint">${t.hint}${t.link ? ` <a href="messages.html" style="color:var(--secondary)">Görüntüle</a>` : ""}</p>
      `;
      }).join("")}
    `;
  }

  window.PrivacyPage = {
    toggle(key, needVip) {
      const u = DB.getUser(me.id);
      if (needVip && (u.vip || 0) < needVip) {
        UI.toast(`Bu özellik VIP${needVip} gerektiriyor`, "error");
        return;
      }
      const t = toggles.find(x => x.key === key);
      const priv = Object.assign({}, u.privacy);
      const currentlyOn = t.always ? (priv[key] !== false) : !!priv[key];
      priv[key] = !currentlyOn;
      DB.updateUser(me.id, { privacy: priv });
      render();
    }
  };

  render();
})();
