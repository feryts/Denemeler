# EY LIVE — Web Demo/Prototip

Sesli sohbet + coin/diamond ekonomisi olan sosyal uygulama prototipi.
Düz HTML/CSS/JS ile yazıldı, **build sistemi gerektirmez**, Vercel'e doğrudan deploy edilebilir.

## Demo Hesaplar
- **admin / admin123** — Sistem yöneticisi (Admin Panel)
- **AjansPatronu / 1234** — Ajans sahibi (Ajans Paneli)
- **SesliMelis / 1234** — Yayıncı
- **Gezgin_Ali / 1234** — Normal kullanıcı
- Ya da "Misafir Girişi" ile hızlıca deneyebilirsiniz.

## Klasör Yapısı
```
index.html          → splash + giriş
register.html        → kayıt (telefon, SMS mock, avatar, cinsiyet, doğum tarihi, şifre)
pages/home.html       → ana sayfa
pages/room.html       → 12 mikrofonlu sesli oda
pages/profile.html    → profil
pages/messages.html   → mesajlar + bildirimler
pages/wallet.html     → cüzdan (coin/diamond/VIP/geçmiş)
pages/games.html      → oyunlar (slot, çark, zar, günlük/haftalık ödül)
pages/agency.html     → ajans paneli
pages/admin.html      → admin paneli
css/                  → tüm stiller
js/db.js              → mock veritabanı (localStorage)
js/firebase-config.js → gerçek Firebase'e geçiş için hazır şablon
```

## Önemli Not — Mock Backend
Bu proje şu an **gerçek bir backend'e bağlı değil**. Tüm veri (kullanıcılar, odalar,
coin/diamond, mesajlar vb.) `js/db.js` üzerinden tarayıcının **localStorage**'ında
tutuluyor. Yani:

- Farklı tarayıcılar/cihazlar arasında veri paylaşılmaz.
- Sayfayı "Temizle" (localStorage temizlenirse) veriler sıfırlanır.
- Gerçek zamanlı çoklu kullanıcı deneyimi (örn. iki farklı telefonun aynı odada
  birbirini canlı görmesi) bu aşamada YOKTUR — her tarayıcı kendi kopyasını görür.

## Gerçek Backend'e Geçiş
`js/firebase-config.js` içinde detaylı yönergeler var. Özetle: Firebase projesi
açıp `firebaseConfig`'i doldurduktan sonra, `js/db.js` içindeki fonksiyonları
(`createUser`, `sendGift`, `sendMessage` vb.) Firestore/Auth çağrılarıyla
değiştirmeniz yeterli — diğer tüm sayfa kodları (`home.js`, `room.js`, ...)
sadece `DB.xxx()` fonksiyonlarını çağırdığı için değişmeden çalışmaya devam eder.

## Vercel'e Deploy
Bu proje düz statik bir sitedir, herhangi bir build adımı yok:
1. Bu klasörü GitHub reposuna push edin (veya Vercel CLI ile `vercel deploy`).
2. Vercel projede "Framework Preset" olarak **Other** seçin.
3. Build Command / Output Directory boş bırakın — proje kökü direkt statik olarak sunulur.
