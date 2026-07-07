/* ===========================================
   EY LIVE — FIREBASE CONFIG (STUB)
   -------------------------------------------
   Bu proje şu an gerçek Firebase'e bağlı DEĞİL.
   Tüm veriler js/db.js içinde localStorage'da
   tutuluyor (mock backend).

   Gerçek Firebase'e geçmek için:

   1) https://console.firebase.google.com üzerinden
      proje oluşturun, Authentication (Telefon/SMS),
      Firestore, Storage ve Cloud Messaging'i açın.

   2) Aşağıdaki firebaseConfig objesini kendi
      projenizin bilgileriyle doldurun.

   3) index.html / register.html içine şu SDK
      scriptlerini ekleyin:

      <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-app-compat.js"></script>
      <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-auth-compat.js"></script>
      <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore-compat.js"></script>
      <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-storage-compat.js"></script>

   4) js/db.js içindeki fonksiyonları (createUser,
      sendMessage, sendGift, vb.) Firestore
      okuma/yazma çağrılarıyla değiştirin. Dışarıdan
      çağıran sayfa kodları (home.js, room.js, ...)
      DEĞİŞMEDEN çalışmaya devam eder — hepsi sadece
      DB.xxx() fonksiyonlarını çağırıyor.
=========================================== */

const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

const FIREBASE_ENABLED = false;

if (FIREBASE_ENABLED && window.firebase) {
  firebase.initializeApp(firebaseConfig);
}

window.firebaseConfig = firebaseConfig;
window.FIREBASE_ENABLED = FIREBASE_ENABLED;
