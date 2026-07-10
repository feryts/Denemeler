/* ===========================================
   EY LIVE — AYARLAR (settings.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  function render() {
    document.getElementById("settingsPage").innerHTML = `
      ${UI.topBar("Ayarlar", { back: true })}

      <div class="settRow" onclick="UI.toast('Hesap güvenliği yakında')" style="cursor:pointer">
        <span class="rTitle">Hesap &amp; Güvenlik</span>
        <span class="rVal" style="color:var(--danger)">Düşük ›</span>
      </div>

      <div class="settRow" onclick="location.href='privacy.html'" style="cursor:pointer">
        <span class="rTitle">Gizlilik</span>
        <span class="rVal">›</span>
      </div>

      <div class="settRow" onclick="Settings.pickLanguage()" style="cursor:pointer">
        <span class="rTitle">Dil</span>
        <span class="rVal">Türkçe ›</span>
      </div>

      <div class="settRow" onclick="UI.toast('Paylaşım linki kopyalandı', 'success')" style="cursor:pointer">
        <span class="rTitle">Paylaşmak</span>
        <span class="rVal">›</span>
      </div>

      <div class="settRow" onclick="UI.toast('EY LIVE v1.0')" style="cursor:pointer">
        <span class="rTitle">Hakkında</span>
        <span class="rVal">›</span>
      </div>

      <div class="settRow danger" style="justify-content:center;margin-top:18px;cursor:pointer" onclick="Settings.logout()">
        <span class="rTitle">Oturumu kapat</span>
      </div>
    `;
  }

  window.Settings = {
    pickLanguage() { UI.toast("Şu an yalnızca Türkçe destekleniyor"); },
    logout() { UI.confirm("Oturumu kapatmak istiyor musun?", () => UI.logout()); }
  };

  render();
})();
