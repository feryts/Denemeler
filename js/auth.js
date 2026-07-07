/* ===========================================
   EY LIVE — AUTH (auth.js)
=========================================== */

const Auth = {

  /* ---- LOGIN PAGE BOOT ---- */
  initLogin() {
    const existing = DB.currentUser();
    setTimeout(() => {
      document.getElementById("splash").style.display = "none";
      if (existing && !existing.banned) {
        window.location.href = "pages/home.html";
      } else {
        document.getElementById("loginPage").style.display = "block";
      }
    }, 1800);
  },

  login() {
    const id = document.getElementById("loginId").value.trim();
    const pass = document.getElementById("loginPass").value;
    if (!id || !pass) { UI.toast("Lütfen tüm alanları doldurun", "error"); return; }
    const user = DB.getUserByPhoneOrUsername(id);
    if (!user || user.password !== pass) { UI.toast("Telefon/kullanıcı adı veya şifre hatalı", "error"); return; }
    if (user.banned) { UI.toast("Bu hesap askıya alınmış: " + user.banReason, "error"); return; }
    DB.setSession(user.id);
    DB.updateUser(user.id, { online: true, lastSeen: Date.now() });
    UI.toast("Hoş geldin, " + user.username + "!", "success");
    setTimeout(() => window.location.href = "pages/home.html", 500);
  },

  guestLogin() {
    const guest = DB.createUser({
      username: "Misafir" + Math.floor(Math.random() * 9000 + 1000),
      phone: "guest" + Date.now(),
      password: "",
      role: "guest",
      avatar: "🙂"
    });
    DB.setSession(guest.id);
    UI.toast("Misafir olarak giriş yapıldı", "success");
    setTimeout(() => window.location.href = "pages/home.html", 400);
  },

  goRegister() { window.location.href = "register.html"; },

  /* ---- REGISTER FLOW ---- */
  _reg: { phone: "", avatar: "🙂", gender: "" },

  initRegister() {
    document.getElementById("topbarHost").innerHTML = UI.topBar("Kayıt Ol", { back: true });
    this.renderStepDots(1);
    const avatars = ["🙂","😎","🥳","🦄","🐱","🐶","🦊","🐼","👩","👨","🧑‍🎤","🧑‍🚀","👽","🤖","🌸","🔥"];
    document.getElementById("avatarPicker").innerHTML = avatars.map((a, i) => `
      <div class="avatarOpt ${i === 0 ? "selected" : ""}" data-a="${a}" onclick="Auth.pickAvatar('${a}', this)">${a}</div>
    `).join("");
    document.querySelectorAll(".genderBtn").forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll(".genderBtn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        this._reg.gender = btn.dataset.g;
      };
    });
    document.getElementById("regUsername").addEventListener("input", (e) => {
      const v = e.target.value.trim();
      const hint = document.getElementById("usernameHint");
      if (!v) { hint.textContent = ""; return; }
      const taken = DB.getUserByPhoneOrUsername(v);
      hint.textContent = taken ? "❌ Bu kullanıcı adı alınmış" : "✅ Kullanılabilir";
      hint.style.color = taken ? "var(--danger)" : "var(--success)";
    });
  },

  renderStepDots(step) {
    document.getElementById("stepDots").innerHTML = [1,2,3].map(i =>
      `<span class="${i <= step ? "active" : ""}"></span>`).join("");
  },

  pickAvatar(a, el) {
    document.querySelectorAll(".avatarOpt").forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");
    this._reg.avatar = a;
  },

  regSendSms(resend) {
    const phone = document.getElementById("regPhone").value.trim();
    if (!resend) {
      if (phone.length < 10) { UI.toast("Geçerli bir telefon numarası girin", "error"); return; }
      if (DB.getUserByPhoneOrUsername(phone)) { UI.toast("Bu telefon numarası zaten kayıtlı", "error"); return; }
      this._reg.phone = phone;
    }
    UI.toast("📲 SMS kodu gönderildi (demo)", "success");
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    this.renderStepDots(2);
    document.querySelectorAll(".otpBox").forEach((box, i, all) => {
      box.oninput = () => { if (box.value && all[i + 1]) all[i + 1].focus(); };
    });
  },

  regVerifySms() {
    const boxes = document.querySelectorAll(".otpBox");
    const code = Array.from(boxes).map(b => b.value).join("");
    if (code.length < 4) { UI.toast("4 haneli kodu girin", "error"); return; }
    UI.toast("✅ Telefon doğrulandı", "success");
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "block";
    this.renderStepDots(3);
  },

  completeRegister() {
    const username = document.getElementById("regUsername").value.trim();
    const birth = document.getElementById("regBirth").value;
    const pass = document.getElementById("regPass").value;

    if (!username) { UI.toast("Kullanıcı adı girin", "error"); return; }
    if (DB.getUserByPhoneOrUsername(username)) { UI.toast("Bu kullanıcı adı alınmış", "error"); return; }
    if (!this._reg.gender) { UI.toast("Cinsiyet seçin", "error"); return; }
    if (!birth) { UI.toast("Doğum tarihi girin", "error"); return; }
    if (!pass || pass.length < 4) { UI.toast("Şifre en az 4 karakter olmalı", "error"); return; }

    const user = DB.createUser({
      phone: this._reg.phone || ("u" + Date.now()),
      username, password: pass, gender: this._reg.gender,
      birthdate: birth, avatar: this._reg.avatar
    });
    DB.setSession(user.id);
    DB.addNotification(user.id, "EY LIVE ailesine hoş geldin! 🎉", "system");
    UI.toast("Kayıt tamamlandı, hoş geldin! 🎉", "success");
    setTimeout(() => window.location.href = "pages/home.html", 600);
  }

};

window.Auth = Auth;

if (document.getElementById("splash")) {
  Auth.initLogin();
}
