// Uygulama Durum Yapısı (State)
// Vercel üzerindeki ham canlı yayın istatistiklerini buraya bağladık
const userProfileState = {
    username: "EY LIVE",
    id: "3047826",
    monthlyHours: "126 Saat",
    popularity: "8.2M",
    friends: 556,
    following: 986,
    fans: 675,
    xcoins: 99,
    diamonds: 600
};

// Sayfa Yüklendiğinde Elementleri Dolduran Fonksiyon
function initProfileDOM() {
    document.getElementById('username-display').innerText = userProfileState.username;
    document.getElementById('id-display').innerText = userProfileState.id;
    document.getElementById('hours-display').innerText = userProfileState.monthlyHours;
    document.getElementById('pop-display').innerText = userProfileState.popularity;
    document.getElementById('friends-count').innerText = userProfileState.friends;
    document.getElementById('following-count').innerText = userProfileState.following;
    document.getElementById('fans-count').innerText = userProfileState.fans;
    document.getElementById('xcoins-display').innerText = userProfileState.xcoins;
    document.getElementById('diamonds-display').innerText = userProfileState.diamonds;
}

// ID Kopyalama Özelliği Tetikleyicisi
document.querySelector('.copy-icon').addEventListener('click', () => {
    navigator.clipboard.writeText(userProfileState.id).then(() => {
        alert('Kullanıcı ID başarıyla kopyalandı: ' + userProfileState.id);
    }).catch(err => {
        console.error('Kopyalama başarısız:', err);
    });
});

// Sayfa hazır olduğunda çalıştır
document.addEventListener('DOMContentLoaded', initProfileDOM);
