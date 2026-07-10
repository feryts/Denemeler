/* ===========================================
   EY LIVE — NOBLE MERKEZİ (noble.js)
=========================================== */

(function () {
  const me = UI.requireAuth();
  if (!me) return;

  function daysUntilMonthEnd() {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return Math.max(1, Math.ceil((end - now) / 86400000));
  }

  function render() {
    const u = DB.getUser(me.id);
    const p = DB.nobleProgress(u);
    const pct = Math.min(100, Math.round((p.cur / p.need) * 100));
    const label = p.level > 0 ? "N" + p.level : "N1";

    document.getElementById("noblePage").innerHTML = `
      ${UI.topBar("Noble Merkezi", { back: true, right: `<button class="topBtn">🏆</button>` })}

      <div class="progHero">
        <div class="flexCenter" style="justify-content:center;gap:8px;margin-bottom:6px">
          <div class="avatarCircle" style="width:40px;height:40px;font-size:18px">${u.avatar}</div>
          <span class="pill">seviye: 🦌N${Math.max(1, p.level)}</span>
        </div>
        <p class="lvSub">${p.level > 0 ? "Noble seviyeniz: " + label : "Henüz noble değilsiniz"}</p>
        <div class="badgeImg" style="font-size:70px">🦌</div>
        <div class="lvName">N${Math.max(1, p.level)}</div>
      </div>

      <div class="progBarRow">
        <div class="progTrack"><div class="fill" style="width:${pct}%"></div></div>
      </div>
      <p class="progNote">${p.cur.toLocaleString("tr-TR")}/${(p.need / 1000).toFixed(2)}K (${daysUntilMonthEnd()} gün içinde sıfırlanacak) — N${p.next}</p>

      <div class="sectionTitle" style="justify-content:center"><span>Öncelik ${p.level}/20</span></div>

      <div class="rewardGrid" style="grid-template-columns:repeat(3,1fr)">
        <div class="rewardCard unlocked"><div class="rIcon">🦌</div><div class="rName">Rozet</div></div>
        <div class="rewardCard unlocked"><div class="rIcon">🖼️</div><div class="rName">Çerçeve</div></div>
        <div class="rewardCard unlocked"><div class="rIcon">💬</div><div class="rName">Konuşma Balonu</div></div>
      </div>

      <p class="settHint" style="margin:16px 20px">
        Belirlenen kanallar üzerinden yüklenen her 1 Xcoin, 1 puan değerindedir. Puanlar, Noble seviyenizi yükseltmek için kullanılabilir.
        Her yükseltme ve ilgili öncelikler gelecek ayın sonuna kadar geçerli olacaktır. Tüm kullanıcı puanları her ayın sonunda sıfırlanır.
      </p>

      <a href="wallet.html" class="ctaBtn gold">Noble Puanları kazan</a>
    `;
  }

  render();
})();
