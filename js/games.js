/* ===========================================
   EY LIVE — GAMES (games.js)
=========================================== */

(function () {
  const me0 = UI.requireAuth();
  if (!me0) return;

  document.getElementById("navHost").innerHTML = UI.bottomNav("games");

  let bet = 20;
  let activeGame = null;

  function me() { return DB.getUser(me0.id); }

  function renderHome() {
    activeGame = null;
    const u = me();
    document.getElementById("gamesPage").innerHTML = `
      ${UI.topBar("Oyunlar")}
      <div class="card" style="margin-bottom:16px">
        <div class="flexBetween"><span class="muted">Bakiyen</span><b>💰 ${u.coin}</b></div>
      </div>

      <div class="sectionTitle"><span>🎮 Oyunlar</span></div>
      <div class="gameGrid">
        <div class="gameCard" onclick="Games.open('slot')"><div class="gIcon">🎰</div><div class="gName">Lucky Slot</div><div class="gMin">min 10</div></div>
        <div class="gameCard" onclick="Games.open('wheel')"><div class="gIcon">🎡</div><div class="gName">Çark Çevir</div><div class="gMin">min 20</div></div>
        <div class="gameCard" onclick="Games.open('dice')"><div class="gIcon">🎲</div><div class="gName">Zar At</div><div class="gMin">min 5</div></div>
      </div>

      <div class="sectionTitle"><span>🗓️ Günlük Ödül</span></div>
      <div class="card flexBetween">
        <span>Her gün giriş yaptığında ödül kazan</span>
        <button class="btn btnPrimary btnSm" onclick="Games.claimDaily()">+10 💰</button>
      </div>

      <div class="sectionTitle"><span>📅 Haftalık Görev</span></div>
      <div class="card flexBetween">
        <span>Bu hafta 5 odaya katıl</span>
        <button class="btn btnGhost btnSm" onclick="Games.claimWeekly()">+100 💰</button>
      </div>

      <div class="sectionTitle"><span>🎉 Etkinlik Oyunları</span></div>
      <div class="card">
        <div class="flexBetween"><span>🏆 Haftanın Yayıncısı Etkinliği</span><span class="pill">Devam Ediyor</span></div>
        <p class="muted" style="margin-top:8px">En çok hediye alan yayıncı bu hafta sonu ödüllendirilecek!</p>
      </div>
    `;
  }

  function betControls() {
    return `
      <div class="betRow">
        <button onclick="Games.changeBet(-10)">−</button>
        <span class="betVal">💰 ${bet}</span>
        <button onclick="Games.changeBet(10)">+</button>
      </div>`;
  }

  function renderSlot() {
    activeGame = "slot";
    document.getElementById("gamesPage").innerHTML = `
      ${UI.topBar("Lucky Slot", { back: true })}
      <p class="muted" style="text-align:center">Bakiye: 💰 ${me().coin}</p>
      <div class="slotWrap" id="slotWrap">
        <div class="slotBox">🍒</div><div class="slotBox">🍋</div><div class="slotBox">7️⃣</div>
      </div>
      <div class="resultBanner" id="resultBanner"></div>
      ${betControls()}
      <button class="btn btnPrimary btnBlock" onclick="Games.play('slot')">🎰 Çevir</button>
    `;
  }

  function renderWheel() {
    activeGame = "wheel";
    document.getElementById("gamesPage").innerHTML = `
      ${UI.topBar("Çark Çevir", { back: true })}
      <p class="muted" style="text-align:center">Bakiye: 💰 ${me().coin}</p>
      <div class="wheelBox" id="wheelBox">🎯</div>
      <div class="resultBanner" id="resultBanner"></div>
      ${betControls()}
      <button class="btn btnPrimary btnBlock" onclick="Games.play('wheel')">🎡 Çevir</button>
    `;
  }

  function renderDice() {
    activeGame = "dice";
    document.getElementById("gamesPage").innerHTML = `
      ${UI.topBar("Zar At", { back: true })}
      <p class="muted" style="text-align:center">Bakiye: 💰 ${me().coin}</p>
      <div class="diceBox" id="diceBox">🎲</div>
      <div class="resultBanner" id="resultBanner"></div>
      ${betControls()}
      <button class="btn btnPrimary btnBlock" onclick="Games.play('dice')">🎲 At</button>
    `;
  }

  window.Games = {
    open(g) {
      if (g === "slot") renderSlot();
      if (g === "wheel") renderWheel();
      if (g === "dice") renderDice();
    },
    changeBet(d) {
      bet = Math.max(5, bet + d);
      const el = document.querySelector(".betVal");
      if (el) el.textContent = "💰 " + bet;
    },
    claimDaily() {
      DB.claimDailyTask(me0.id, "t1");
      UI.toast("Günlük ödül alındı! 🎁", "success");
      renderHome();
    },
    claimWeekly() {
      const u = me();
      DB.updateUser(u.id, { coin: u.coin + 100 });
      DB.addWalletTx(u.id, "task_reward", 100, "coin", "Haftalık görev ödülü");
      UI.toast("Haftalık ödül alındı! 🎉", "success");
      renderHome();
    },
    play(gameId) {
      const u = me();
      if (u.coin < bet) { UI.toast("Yetersiz coin", "error"); return; }
      const banner = document.getElementById("resultBanner");
      banner.textContent = "";

      if (gameId === "slot") {
        const box = document.getElementById("slotWrap");
        box.querySelectorAll(".slotBox").forEach(b => b.classList.add("spin"));
        setTimeout(() => {
          const res = DB.playGame(me0.id, "slot", bet);
          box.querySelectorAll(".slotBox").forEach(b => b.classList.remove("spin"));
          const icons = ["🍒","🍋","🍇","7️⃣","💎"];
          box.querySelectorAll(".slotBox").forEach(b => b.textContent = icons[Math.floor(Math.random() * icons.length)]);
          banner.textContent = res.result + (res.win ? ` (+${res.win} 💰)` : "");
          banner.style.color = res.win ? "var(--success)" : "var(--danger)";
        }, 700);
      }

      if (gameId === "wheel") {
        const wheel = document.getElementById("wheelBox");
        const deg = 1440 + Math.floor(Math.random() * 360);
        wheel.style.transform = `rotate(${deg}deg)`;
        setTimeout(() => {
          const res = DB.playGame(me0.id, "wheel", bet);
          banner.textContent = res.result + (res.win ? ` (+${res.win} 💰)` : "");
          banner.style.color = res.win ? "var(--success)" : "var(--danger)";
        }, 2000);
      }

      if (gameId === "dice") {
        const dice = document.getElementById("diceBox");
        dice.classList.add("rolling");
        setTimeout(() => {
          const res = DB.playGame(me0.id, "dice", bet);
          dice.classList.remove("rolling");
          const faces = ["", "⚀","⚁","⚂","⚃","⚄","⚅"];
          const match = res.result.match(/(\d)/);
          dice.textContent = match ? faces[parseInt(match[1])] : "🎲";
          banner.textContent = res.result + (res.win ? ` (+${res.win} 💰)` : "");
          banner.style.color = res.win ? "var(--success)" : "var(--danger)";
        }, 700);
      }
    }
  };

  renderHome();
})();
