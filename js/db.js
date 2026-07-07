/* ===========================================
   EY LIVE — MOCK DATABASE LAYER (db.js)
   -------------------------------------------
   Bu dosya, gerçek bir backend/Firebase bağlanana
   kadar tüm veriyi tarayıcının localStorage'ında
   tutan sahte (mock) bir veritabanı katmanıdır.

   Gerçek Firebase'e geçerken tek yapmanız gereken:
   bu dosyadaki fonksiyonların içini Firestore/Auth
   çağrılarıyla değiştirmek — dışarıdan çağıran hiçbir
   sayfa kodu değişmeyecek şekilde tasarlandı.
   (Bkz: js/firebase-config.js)
=========================================== */

const DB_KEY = "eylive_db_v1";

const DB = {

  /* ---------- CORE ---------- */

  _data: null,

  load() {
    if (this._data) return this._data;
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      this._data = JSON.parse(raw);
    } else {
      this._data = this.seed();
      this.save();
    }
    return this._data;
  },

  save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this._data));
  },

  reset() {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem("eylive_session");
    this._data = null;
    this.load();
  },

  nextId(prefix, counterKey, pad = 9) {
    const d = this.load();
    d.counters[counterKey] = (d.counters[counterKey] || 0) + 1;
    this.save();
    return prefix + String(d.counters[counterKey]).padStart(pad, "0");
  },

  now() { return Date.now(); },

  /* ---------- SEED DATA ---------- */

  seed() {
    const users = [
      {
        id: "EY100000001", phone: "5550000001", username: "admin",
        password: "admin123", gender: "erkek", birthdate: "1995-01-01",
        avatar: "👑", cover: "", coin: 999999, diamond: 999999,
        level: 99, exp: 0, vip: 7, verified: true, role: "admin",
        agencyId: null, about: "EY LIVE Sistem Yöneticisi",
        followers: [], following: [], online: true, lastSeen: Date.now(),
        banned: false, banReason: "", createdAt: Date.now()
      },
      {
        id: "EY100000002", phone: "5550000002", username: "AjansPatronu",
        password: "1234", gender: "kadın", birthdate: "1990-05-12",
        avatar: "🧑‍💼", cover: "", coin: 50000, diamond: 20000,
        level: 40, exp: 0, vip: 5, verified: true, role: "agency",
        agencyId: "AG10000001", about: "Yıldız Ajans kurucusu",
        followers: [], following: [], online: true, lastSeen: Date.now(),
        banned: false, banReason: "", createdAt: Date.now()
      },
      {
        id: "EY100000003", phone: "5550000003", username: "SesliMelis",
        password: "1234", gender: "kadın", birthdate: "1999-03-20",
        avatar: "🎤", cover: "", coin: 3200, diamond: 8400,
        level: 27, exp: 0, vip: 3, verified: true, role: "streamer",
        agencyId: "AG10000001", about: "Her gece burada 🎶",
        followers: ["EY100000004"], following: [], online: true, lastSeen: Date.now(),
        banned: false, banReason: "", createdAt: Date.now()
      },
      {
        id: "EY100000004", phone: "5550000004", username: "Gezgin_Ali",
        password: "1234", gender: "erkek", birthdate: "1997-07-07",
        avatar: "🧑", cover: "", coin: 500, diamond: 20,
        level: 8, exp: 0, vip: 0, verified: false, role: "user",
        agencyId: null, about: "Merhaba, EY LIVE'da yeniyim!",
        followers: [], following: ["EY100000003"], online: true, lastSeen: Date.now(),
        banned: false, banReason: "", createdAt: Date.now()
      },
      {
        id: "EY100000005", phone: "5550000005", username: "ModEce",
        password: "1234", gender: "kadın", birthdate: "1998-11-02",
        avatar: "🛡️", cover: "", coin: 1200, diamond: 300,
        level: 15, exp: 0, vip: 1, verified: true, role: "user",
        agencyId: null, about: "Oda moderatörü", followers: [], following: [],
        online: false, lastSeen: Date.now() - 3600_000, banned: false, banReason: "",
        createdAt: Date.now()
      }
    ];

    const agencies = [
      {
        id: "AG10000001", name: "Yıldız Ajans", ownerId: "EY100000002",
        streamers: ["EY100000003"], applications: [
          { userId: "EY100000005", status: "pending", ts: Date.now() - 86400000 }
        ],
        earnings: 15420, announcements: [
          { id: "AN1", text: "Bu ay en çok kazanan yayıncımız SesliMelis! 🎉", ts: Date.now() - 172800000 }
        ]
      }
    ];

    const rooms = [
      {
        id: "R1001", name: "🎶 Gece Sohbeti", cover: "🎧", category: "Sohbet",
        hostId: "EY100000003", level: 12, tags: ["müzik", "sohbet"],
        popular: true, locked: false, password: "",
        mics: Array.from({ length: 12 }, (_, i) => ({
          seat: i,
          userId: i === 0 ? "EY100000003" : (i === 1 ? "EY100000004" : null),
          locked: false, muted: false
        })),
        handsRaised: [],
        chat: [
          { id: "m1", userId: "EY100000003", text: "Herkese merhaba! 🎤", type: "text", ts: Date.now() - 60000 },
          { id: "m2", userId: "EY100000004", text: "Selam! 👋", type: "text", ts: Date.now() - 30000 }
        ],
        rules: "1) Saygılı olun\n2) Reklam yasak\n3) Küfür yasak",
        admins: ["EY100000003"],
        createdAt: Date.now() - 3600000
      },
      {
        id: "R1002", name: "🔥 Yeni Başlayanlar", cover: "✨", category: "Oyun",
        hostId: "EY100000005", level: 5, tags: ["oyun"],
        popular: true, locked: false, password: "",
        mics: Array.from({ length: 12 }, (_, i) => ({
          seat: i, userId: i === 0 ? "EY100000005" : null, locked: i === 11, muted: false
        })),
        handsRaised: [],
        chat: [], rules: "Eğlenceli vakit geçirin!", admins: ["EY100000005"],
        createdAt: Date.now() - 1800000
      },
      {
        id: "R1003", name: "💎 VIP Lounge", cover: "💎", category: "VIP",
        hostId: "EY100000002", level: 30, tags: ["vip"],
        popular: false, locked: true, password: "1234",
        mics: Array.from({ length: 12 }, (_, i) => ({
          seat: i, userId: i === 0 ? "EY100000002" : null, locked: i > 3, muted: false
        })),
        handsRaised: [], chat: [], rules: "Sadece VIP 3+ üyeler.",
        admins: ["EY100000002"], createdAt: Date.now() - 7200000
      }
    ];

    const gifts = [
      { id: "g1", name: "Gül", icon: "🌹", price: 10 },
      { id: "g2", name: "Kalp", icon: "❤️", price: 20 },
      { id: "g3", name: "Taç", icon: "👑", price: 100 },
      { id: "g4", name: "Roket", icon: "🚀", price: 500 },
      { id: "g5", name: "Elmas Yağmuru", icon: "💎", price: 1000 },
      { id: "g6", name: "Araba", icon: "🚗", price: 5000 },
      { id: "g7", name: "Uçak", icon: "✈️", price: 15000 },
      { id: "g8", name: "Şato", icon: "🏰", price: 50000 }
    ];

    const vipLevels = [
      { level: 0, name: "VIP Yok", price: 0, perks: [] },
      { level: 1, name: "Bronz VIP", price: 49, perks: ["Bronz rozet", "Günlük +50 coin"] },
      { level: 2, name: "Gümüş VIP", price: 99, perks: ["Gümüş rozet", "Özel giriş efekti"] },
      { level: 3, name: "Altın VIP", price: 199, perks: ["Altın rozet", "Odalarda öncelik"] },
      { level: 4, name: "Platin VIP", price: 399, perks: ["Platin rozet", "Özel çerçeve"] },
      { level: 5, name: "Elmas VIP", price: 799, perks: ["Elmas rozet", "Reklamsız"] },
      { level: 6, name: "Kraliyet VIP", price: 1499, perks: ["Kraliyet rozet", "Kişisel destek"] },
      { level: 7, name: "Efsane VIP", price: 2999, perks: ["Efsane rozet", "Tüm ayrıcalıklar"] }
    ];

    const coinPackages = [
      { id: "c1", coin: 100, price: "₺19,99" },
      { id: "c2", coin: 550, price: "₺89,99" },
      { id: "c3", coin: 1200, price: "₺179,99" },
      { id: "c4", coin: 6500, price: "₺899,99" },
      { id: "c5", coin: 15000, price: "₺1899,99" }
    ];

    const games = [
      { id: "slot", name: "Lucky Slot", icon: "🎰", minBet: 10 },
      { id: "wheel", name: "Çark Çevir", icon: "🎡", minBet: 20 },
      { id: "dice", name: "Zar At", icon: "🎲", minBet: 5 }
    ];

    const dailyTasks = [
      { id: "t1", text: "Bugün giriş yap", reward: 10, type: "login" },
      { id: "t2", text: "Bir odaya katıl", reward: 15, type: "join_room" },
      { id: "t3", text: "5 dakika mikrofonda konuş", reward: 20, type: "speak" },
      { id: "t4", text: "Bir hediye gönder", reward: 25, type: "send_gift" }
    ];

    const announcements = [
      { id: "sys1", title: "EY LIVE'a Hoş Geldiniz!", text: "Uygulamamızı keşfedin, arkadaşlar edinin ve sesli odalarda vakit geçirin 🎉", ts: Date.now() - 86400000 },
      { id: "sys2", title: "Yeni Hediyeler Eklendi", text: "Mağazaya yeni hediyeler eklendi, hemen göz atın! 🎁", ts: Date.now() - 43200000 }
    ];

    return {
      counters: { user: 5, agency: 1, room: 1003, notif: 0, msg: 0, tx: 0, log: 0 },
      users, agencies, rooms, gifts, vipLevels, coinPackages, games, dailyTasks,
      announcements, notifications: [], conversations: [], walletTx: [], adminLogs: [],
      bans: []
    };
  },

  /* ---------- SESSION ---------- */

  getSession() {
    const raw = localStorage.getItem("eylive_session");
    return raw ? JSON.parse(raw) : null;
  },

  setSession(userId) {
    localStorage.setItem("eylive_session", JSON.stringify({ userId, ts: Date.now() }));
  },

  clearSession() {
    localStorage.removeItem("eylive_session");
  },

  currentUser() {
    const s = this.getSession();
    if (!s) return null;
    return this.getUser(s.userId);
  },

  /* ---------- USERS ---------- */

  getUser(id) {
    return this.load().users.find(u => u.id === id) || null;
  },

  getUserByPhoneOrUsername(v) {
    return this.load().users.find(u => u.phone === v || u.username === v) || null;
  },

  createUser(partial) {
    const d = this.load();
    const id = this.nextId("EY1", "user");
    const user = Object.assign({
      id, coin: 100, diamond: 0, level: 1, exp: 0, vip: 0, verified: false,
      role: "user", agencyId: null, about: "", followers: [], following: [],
      online: true, lastSeen: Date.now(), banned: false, banReason: "",
      createdAt: Date.now(), avatar: "🙂", cover: ""
    }, partial);
    d.users.push(user);
    this.save();
    return user;
  },

  updateUser(id, patch) {
    const d = this.load();
    const u = d.users.find(x => x.id === id);
    if (!u) return null;
    Object.assign(u, patch);
    this.save();
    return u;
  },

  allUsers() { return this.load().users; },

  toggleFollow(myId, targetId) {
    const me = this.getUser(myId), target = this.getUser(targetId);
    if (!me || !target) return;
    const i = me.following.indexOf(targetId);
    if (i >= 0) {
      me.following.splice(i, 1);
      target.followers = target.followers.filter(f => f !== myId);
    } else {
      me.following.push(targetId);
      target.followers.push(myId);
    }
    this.save();
  },

  /* ---------- BAN SYSTEM ---------- */

  banUser(id, reason) {
    this.updateUser(id, { banned: true, banReason: reason || "Kural ihlali" });
    this.addAdminLog("ban", id, "Kullanıcı banlandı: " + reason);
  },

  unbanUser(id) {
    this.updateUser(id, { banned: false, banReason: "" });
    this.addAdminLog("unban", id, "Ban kaldırıldı");
  },

  /* ---------- ROOMS ---------- */

  allRooms() { return this.load().rooms; },

  getRoom(id) { return this.load().rooms.find(r => r.id === id) || null; },

  createRoom(partial) {
    const d = this.load();
    const id = this.nextId("R", "room", 4);
    const room = Object.assign({
      id, level: 1, tags: [], popular: false, locked: false, password: "",
      mics: Array.from({ length: 12 }, (_, i) => ({ seat: i, userId: null, locked: false, muted: false })),
      handsRaised: [], chat: [], rules: "", admins: [], createdAt: Date.now()
    }, partial);
    d.rooms.push(room);
    this.save();
    return room;
  },

  updateRoom(id, patch) {
    const d = this.load();
    const r = d.rooms.find(x => x.id === id);
    if (!r) return null;
    Object.assign(r, patch);
    this.save();
    return r;
  },

  deleteRoom(id) {
    const d = this.load();
    d.rooms = d.rooms.filter(r => r.id !== id);
    this.save();
  },

  sitOnMic(roomId, seat, userId) {
    const r = this.getRoom(roomId);
    if (!r) return { ok: false, msg: "Oda bulunamadı" };
    const mic = r.mics[seat];
    if (mic.locked) return { ok: false, msg: "Bu mikrofon kilitli" };
    if (mic.userId) return { ok: false, msg: "Bu mikrofon dolu" };
    r.mics.forEach(m => { if (m.userId === userId) m.userId = null; });
    mic.userId = userId;
    r.handsRaised = r.handsRaised.filter(h => h !== userId);
    this.save();
    return { ok: true };
  },

  leaveMic(roomId, userId) {
    const r = this.getRoom(roomId);
    if (!r) return;
    r.mics.forEach(m => { if (m.userId === userId) m.userId = null; });
    this.save();
  },

  toggleMicLock(roomId, seat) {
    const r = this.getRoom(roomId);
    if (!r) return;
    r.mics[seat].locked = !r.mics[seat].locked;
    if (r.mics[seat].locked) r.mics[seat].userId = null;
    this.save();
  },

  raiseHand(roomId, userId) {
    const r = this.getRoom(roomId);
    if (!r) return;
    if (!r.handsRaised.includes(userId)) r.handsRaised.push(userId);
    this.save();
  },

  lowerHand(roomId, userId) {
    const r = this.getRoom(roomId);
    if (!r) return;
    r.handsRaised = r.handsRaised.filter(h => h !== userId);
    this.save();
  },

  sendRoomMessage(roomId, userId, text, type = "text") {
    const r = this.getRoom(roomId);
    if (!r) return;
    r.chat.push({ id: "m" + Date.now(), userId, text, type, ts: Date.now() });
    if (r.chat.length > 200) r.chat.shift();
    this.save();
  },

  setRoomRole(roomId, userId, role) {
    // role: "cohost" | "moderator" | "none"
    const r = this.getRoom(roomId);
    if (!r) return;
    r.coHost = r.coHost || [];
    r.moderators = r.moderators || [];
    r.coHost = r.coHost.filter(u => u !== userId);
    r.moderators = r.moderators.filter(u => u !== userId);
    if (role === "cohost") r.coHost.push(userId);
    if (role === "moderator") r.moderators.push(userId);
    this.save();
  },

  /* ---------- GIFTS / WALLET ---------- */

  allGifts() { return this.load().gifts; },

  sendGift(fromId, toId, giftId, roomId) {
    const d = this.load();
    const gift = d.gifts.find(g => g.id === giftId);
    const from = this.getUser(fromId), to = this.getUser(toId);
    if (!gift || !from || !to) return { ok: false, msg: "Hata" };
    if (from.coin < gift.price) return { ok: false, msg: "Yetersiz coin" };
    from.coin -= gift.price;
    to.diamond += Math.round(gift.price * 0.5);
    this.addWalletTx(fromId, "gift_sent", -gift.price, "coin", `${gift.name} gönderildi -> ${to.username}`);
    this.addWalletTx(toId, "gift_received", Math.round(gift.price * 0.5), "diamond", `${gift.name} alındı <- ${from.username}`);
    if (roomId) this.sendRoomMessage(roomId, fromId, `${gift.icon} ${gift.name} -> ${to.username}`, "gift");
    this.save();
    return { ok: true };
  },

  addWalletTx(userId, type, amount, currency, note) {
    const d = this.load();
    d.walletTx.push({
      id: this.nextId("TX", "tx", 6), userId, type, amount, currency, note, ts: Date.now()
    });
    this.save();
  },

  userWalletTx(userId) {
    return this.load().walletTx.filter(t => t.userId === userId).sort((a, b) => b.ts - a.ts);
  },

  buyCoins(userId, pkgId) {
    const d = this.load();
    const pkg = d.coinPackages.find(p => p.id === pkgId);
    const u = this.getUser(userId);
    if (!pkg || !u) return;
    u.coin += pkg.coin;
    this.addWalletTx(userId, "purchase", pkg.coin, "coin", `${pkg.coin} coin satın alındı (${pkg.price})`);
    this.save();
  },

  requestWithdraw(userId, amount) {
    const u = this.getUser(userId);
    if (!u || u.diamond < amount) return { ok: false, msg: "Yetersiz diamond" };
    u.diamond -= amount;
    this.addWalletTx(userId, "withdraw", -amount, "diamond", `Çekim talebi (${amount} diamond) - Beklemede`);
    this.save();
    return { ok: true };
  },

  /* ---------- VIP ---------- */

  buyVip(userId, level) {
    const d = this.load();
    const vip = d.vipLevels.find(v => v.level === level);
    const u = this.getUser(userId);
    if (!vip || !u) return { ok: false };
    if (u.coin < vip.price * 10) return { ok: false, msg: "Yetersiz coin" };
    u.coin -= vip.price * 10;
    u.vip = level;
    this.addWalletTx(userId, "vip", -(vip.price * 10), "coin", `${vip.name} satın alındı`);
    this.save();
    return { ok: true };
  },

  /* ---------- GAMES ---------- */

  playGame(userId, gameId, bet) {
    const u = this.getUser(userId);
    if (!u) return { ok: false, msg: "Kullanıcı yok" };
    if (u.coin < bet) return { ok: false, msg: "Yetersiz coin" };
    u.coin -= bet;
    const roll = Math.random();
    let win = 0, result = "";
    if (gameId === "slot") {
      if (roll > 0.85) { win = bet * 10; result = "🎉 JACKPOT! 7️⃣7️⃣7️⃣"; }
      else if (roll > 0.6) { win = bet * 2; result = "🍒🍒🍒 Kazandın!"; }
      else { result = "🍋🍇🍒 Kaybettin"; }
    } else if (gameId === "wheel") {
      const slices = [0, 0.5, 1, 1.5, 2, 3, 5, 0];
      const mult = slices[Math.floor(Math.random() * slices.length)];
      win = Math.round(bet * mult);
      result = mult > 0 ? `Çark x${mult} geldi!` : "Boş geldi, şansın yok 😅";
    } else if (gameId === "dice") {
      const dice = Math.ceil(Math.random() * 6);
      if (dice >= 5) { win = bet * 3; result = `🎲 ${dice} geldi, kazandın!`; }
      else { result = `🎲 ${dice} geldi, kaybettin`; }
    }
    if (win > 0) {
      u.coin += win;
      this.addWalletTx(userId, "game_win", win, "coin", `${gameId} oyunu kazancı`);
    } else {
      this.addWalletTx(userId, "game_bet", -bet, "coin", `${gameId} oyunu bahis`);
    }
    this.save();
    return { ok: true, win, result };
  },

  claimDailyTask(userId, taskId) {
    const d = this.load();
    const task = d.dailyTasks.find(t => t.id === taskId);
    const u = this.getUser(userId);
    if (!task || !u) return;
    u.coin += task.reward;
    this.addWalletTx(userId, "task_reward", task.reward, "coin", `Görev ödülü: ${task.text}`);
    this.save();
  },

  /* ---------- MESSAGES ---------- */

  getConversation(userA, userB) {
    const d = this.load();
    let convo = d.conversations.find(c =>
      c.participants.includes(userA) && c.participants.includes(userB)
    );
    if (!convo) {
      convo = { id: this.nextId("C", "msg", 6), participants: [userA, userB], messages: [] };
      d.conversations.push(convo);
      this.save();
    }
    return convo;
  },

  userConversations(userId) {
    return this.load().conversations.filter(c => c.participants.includes(userId));
  },

  sendMessage(fromId, toId, text) {
    const convo = this.getConversation(fromId, toId);
    convo.messages.push({ from: fromId, text, ts: Date.now(), read: false });
    this.save();
    return convo;
  },

  markConversationRead(convoId, userId) {
    const d = this.load();
    const c = d.conversations.find(x => x.id === convoId);
    if (!c) return;
    c.messages.forEach(m => { if (m.from !== userId) m.read = true; });
    this.save();
  },

  /* ---------- NOTIFICATIONS ---------- */

  addNotification(userId, text, type = "system") {
    const d = this.load();
    d.notifications.push({
      id: this.nextId("N", "notif", 6), userId, text, type, ts: Date.now(), read: false
    });
    this.save();
  },

  userNotifications(userId) {
    return this.load().notifications.filter(n => n.userId === userId).sort((a, b) => b.ts - a.ts);
  },

  markNotifRead(id) {
    const d = this.load();
    const n = d.notifications.find(x => x.id === id);
    if (n) { n.read = true; this.save(); }
  },

  /* ---------- AGENCY ---------- */

  getAgency(id) { return this.load().agencies.find(a => a.id === id) || null; },

  agencyByOwner(userId) { return this.load().agencies.find(a => a.ownerId === userId) || null; },

  applyToAgency(agencyId, userId) {
    const a = this.getAgency(agencyId);
    if (!a) return;
    if (a.applications.find(x => x.userId === userId)) return;
    a.applications.push({ userId, status: "pending", ts: Date.now() });
    this.save();
  },

  reviewApplication(agencyId, userId, approve) {
    const a = this.getAgency(agencyId);
    if (!a) return;
    const app = a.applications.find(x => x.userId === userId);
    if (!app) return;
    app.status = approve ? "approved" : "rejected";
    if (approve) {
      a.streamers.push(userId);
      this.updateUser(userId, { agencyId, role: "streamer" });
      this.addNotification(userId, `Tebrikler! ${a.name} ajansına katıldınız 🎉`, "agency");
    } else {
      this.addNotification(userId, `${a.name} ajans başvurunuz reddedildi.`, "agency");
    }
    this.save();
  },

  removeStreamer(agencyId, userId) {
    const a = this.getAgency(agencyId);
    if (!a) return;
    a.streamers = a.streamers.filter(s => s !== userId);
    this.updateUser(userId, { agencyId: null, role: "user" });
    this.addNotification(userId, `Ajanstan çıkarıldınız: ${a.name}`, "agency");
    this.save();
  },

  agencyAnnounce(agencyId, text) {
    const a = this.getAgency(agencyId);
    if (!a) return;
    a.announcements.unshift({ id: "AN" + Date.now(), text, ts: Date.now() });
    a.streamers.forEach(uid => this.addNotification(uid, "📢 " + text, "agency"));
    this.save();
  },

  /* ---------- ADMIN ---------- */

  addAdminLog(action, target, note) {
    const d = this.load();
    d.adminLogs.unshift({
      id: this.nextId("LOG", "log", 6), action, target, note, ts: Date.now()
    });
    this.save();
  },

  allAdminLogs() { return this.load().adminLogs; },

  adminAdjustBalance(userId, coin, diamond) {
    const u = this.getUser(userId);
    if (!u) return;
    u.coin += coin;
    u.diamond += diamond;
    this.addAdminLog("balance", userId, `coin:${coin >= 0 ? "+" : ""}${coin} diamond:${diamond >= 0 ? "+" : ""}${diamond}`);
    this.save();
  },

  adminSetVip(userId, level) {
    this.updateUser(userId, { vip: level });
    this.addAdminLog("vip", userId, `VIP seviyesi ${level} yapıldı`);
  },

  globalAnnounce(title, text) {
    const d = this.load();
    d.announcements.unshift({ id: "sys" + Date.now(), title, text, ts: Date.now() });
    this.save();
  },

  stats() {
    const d = this.load();
    return {
      totalUsers: d.users.length,
      totalRooms: d.rooms.length,
      totalAgencies: d.agencies.length,
      totalCoin: d.users.reduce((s, u) => s + u.coin, 0),
      totalDiamond: d.users.reduce((s, u) => s + u.diamond, 0),
      onlineUsers: d.users.filter(u => u.online).length,
      bannedUsers: d.users.filter(u => u.banned).length
    };
  }

};

window.DB = DB;
DB.load();
