/* ==========================================
   EY LIVE ADMIN PANEL
========================================== */

(function () {

const me = DB.currentUser();

if (!me) {
    location.href = "../index.html";
    return;
}

if (me.role !== "admin") {
    alert("Bu sayfaya erişim yetkiniz yok.");
    location.href = "../pages/home.html";
    return;
}

window.Admin = {

    current: "dashboard",

    open(page) {

        this.current = page;

        document
        .querySelectorAll(".adminMenu li")
        .forEach(li => li.classList.remove("active"));

        event.target.classList.add("active");

        document.querySelector(".adminTitle").textContent =
            event.target.innerText;

        if (page === "dashboard") this.dashboard();

        if (page === "users") this.users();

        if (page === "rooms") this.rooms();

        if (page === "agencies") this.agencies();

        if (page === "casino") this.casino();

        if (page === "shop") this.shop();

        if (page === "gifts") this.gifts();

        if (page === "tasks") this.tasks();

        if (page === "wallet") this.wallet();

        if (page === "ranking") this.ranking();

        if (page === "banner") this.banner();

        if (page === "vip") this.vip();

        if (page === "reports") this.reports();

        if (page === "logs") this.logs();

        if (page === "settings") this.settings();

    },
   /*==================================
DASHBOARD
==================================*/

dashboard(){

const s=DB.stats();

document.getElementById("totalUsers").textContent=

s.totalUsers;

document.getElementById("totalRooms").textContent=

s.totalRooms;

document.getElementById("onlineUsers").textContent=

s.onlineUsers;

document.getElementById("totalCoins").textContent=

s.totalCoin.toLocaleString("tr-TR");

const body=

document.getElementById("dashboardContent");

body.innerHTML=`

<div class="statsGrid">

<div class="statBox">

<h4>💎 Toplam Diamond</h4>

<h2>

${s.totalDiamond.toLocaleString("tr-TR")}

</h2>

</div>

<div class="statBox">

<h4>🏢 Toplam Ajans</h4>

<h2>

${s.totalAgencies}

</h2>

</div>

<div class="statBox">

<h4>🚫 Banlı Kullanıcı</h4>

<h2>

${s.bannedUsers}

</h2>

</div>

<div class="statBox">

<h4>🎤 Aktif Oda</h4>

<h2>

${DB.allRooms().length}

</h2>

</div>

<div class="statBox">

<h4>🎮 Casino Oyunu</h4>

<h2>

${DB.load().games.length}

</h2>

</div>

<div class="statBox">

<h4>🎁 Hediye</h4>

<h2>

${DB.allGifts().length}

</h2>

</div>

</div>

<div class="adminCard">

<h2>

⚡ Hızlı Yönetim

</h2>

<div class="formGrid">

<button class="btnAdmin"

onclick="Admin.open('users')">

👤 Kullanıcılar

</button>

<button class="btnAdmin"

onclick="Admin.open('rooms')">

🎤 Odalar

</button>

<button class="btnAdmin"

onclick="Admin.open('casino')">

🎰 Casino

</button>

<button class="btnAdmin"

onclick="Admin.open('tasks')">

📅 Görevler

</button>

<button class="btnAdmin"

onclick="Admin.open('wallet')">

💰 Coin

</button>

<button class="btnAdmin"

onclick="Admin.open('banner')">

🖼 Banner

</button>

</div>

</div>

`;

},
   /*==================================
KULLANICILAR
==================================*/

users(){

const users=DB.allUsers();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<input

class="adminSearch"

id="userSearch"

placeholder="ID, telefon veya kullanıcı adı ara..."

onkeyup="Admin.filterUsers()">

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>ID</th>

<th>Kullanıcı</th>

<th>Telefon</th>

<th>Rol</th>

<th>Coin</th>

<th>Diamond</th>

<th>VIP</th>

<th>Durum</th>

<th>İşlem</th>

</tr>

</thead>

<tbody id="userTable">

${users.map(u=>`

<tr>

<td>${u.id}</td>

<td>${u.username}</td>

<td>${u.phone}</td>

<td>${u.role}</td>

<td>${u.coin}</td>

<td>${u.diamond}</td>

<td>VIP ${u.vip}</td>

<td>

${u.banned

?'<span class="badge badgeDanger">BANLI</span>'

:'<span class="badge badgeSuccess">AKTİF</span>'}

</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editUser('${u.id}')">

Düzenle

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

},
   /*==================================
KULLANICI DÜZENLE
==================================*/

editUser(id){

const u=DB.getUser(id);

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

👤 Kullanıcı Düzenle

</h2>

<div class="formGrid">

<div class="formGroup">

<label>Kullanıcı Adı</label>

<input
id="editUsername"
value="${u.username}">

</div>

<div class="formGroup">

<label>Telefon</label>

<input
id="editPhone"
value="${u.phone}">

</div>

<div class="formGroup">

<label>Coin</label>

<input
id="editCoin"
type="number"
value="${u.coin}">

</div>

<div class="formGroup">

<label>Diamond</label>

<input
id="editDiamond"
type="number"
value="${u.diamond}">

</div>

<div class="formGroup">

<label>VIP</label>

<input
id="editVip"
type="number"
value="${u.vip}">

</div>

<div class="formGroup">

<label>Seviye</label>

<input
id="editLevel"
type="number"
value="${u.level}">

</div>

<div class="formGroup">

<label>Rol</label>

<select id="editRole">

<option value="user"${u.role=="user"?" selected":""}>Kullanıcı</option>

<option value="streamer"${u.role=="streamer"?" selected":""}>Yayıncı</option>

<option value="agency"${u.role=="agency"?" selected":""}>Ajans</option>

<option value="admin"${u.role=="admin"?" selected":""}>Admin</option>

</select>

</div>

</div>

<br>

<button

class="btnAdmin"

onclick="Admin.saveUser('${u.id}')">

💾 Kaydet

</button>

<button

class="btnDanger"

onclick="Admin.banUser('${u.id}')">

🚫 Banla

</button>

<button

class="btnSuccess"

onclick="Admin.unbanUser('${u.id}')">

✅ Ban Kaldır

</button>

<button

class="btnWarning"

onclick="Admin.users()">

⬅ Listeye Dön

</button>

</div>

`;

},
/*==================================
BAN SİSTEMİ
==================================*/

banUser(id){

const reason=

prompt(

"Ban sebebi",

"Kural ihlali"

);

if(reason===null) return;

DB.banUser(id,reason);

UI.toast(

"Kullanıcı banlandı",

"success"

);

this.users();

},

unbanUser(id){

DB.unbanUser(id);

UI.toast(

"Ban kaldırıldı",

"success"

);

this.users();

},
/*==================================
ODALAR
==================================*/

rooms(){

const rooms=DB.allRooms();

const body=

document.getElementById("dashboardContent");

body.innerHTML=`

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>ID</th>

<th>Oda</th>

<th>Host</th>

<th>Kategori</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${rooms.map(r=>`

<tr>

<td>${r.id}</td>

<td>${r.name}</td>

<td>${r.hostId}</td>

<td>${r.category}</td>

<td>

<button

class="btnDanger"

onclick="Admin.closeRoom('${r.id}')">

Kapat

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

},
   /*==================================
ODA KAPAT
==================================*/

closeRoom(id){

if(

!confirm(

"Oda kapatılsın mı?"

)

){

return;

}

DB.deleteRoom(id);

UI.toast(

"Oda kapatıldı",

"success"

);

this.rooms();

},
   /*==================================
CASINO
==================================*/

casino(){

const games=DB.load().games;

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🎰 Casino Yönetimi

</h2>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Oyun</th>

<th>Minimum Bahis</th>

<th>Durum</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${games.map(g=>`

<tr>

<td>${g.icon} ${g.name}</td>

<td>

<input

type="number"

id="bet_${g.id}"

value="${g.minBet}"

style="width:120px">

</td>

<td>

<span class="badge badgeSuccess">

AKTİF

</span>

</td>

<td>

<button

class="btnAdmin"

onclick="Admin.saveGame('${g.id}')">

Kaydet

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
OYUN KAYDET
==================================*/

saveGame(id){

const d=DB.load();

const g=d.games.find(x=>x.id===id);

if(!g) return;

g.minBet=

Number(

document.getElementById(

"bet_"+id

).value

);

DB.save();

UI.toast(

"Oyun güncellendi",

"success"

);

},
/*==================================
CASINO AYARLARI
==================================*/

casinoSettings(){

const body=document.getElementById("dashboardContent");

const cfg=DB.load().casinoConfig||{

slotRtp:96,

sweetRtp:96,

olympusRtp:96,

slotJackpot:1,

sweetJackpot:1,

olympusJackpot:1,

dailyLimit:1000000,

maxWin:500000,

houseEdge:4

};

body.innerHTML=`

<div class="adminCard">

<h2>🎰 Casino RTP Ayarları</h2>

<div class="formGrid">

<div class="formGroup">

<label>Lucky Slot RTP (%)</label>

<input id="slotRtp" type="number" value="${cfg.slotRtp}">

</div>

<div class="formGroup">

<label>Sweet Bonanza RTP (%)</label>

<input id="sweetRtp" type="number" value="${cfg.sweetRtp}">

</div>

<div class="formGroup">

<label>Gates of Olympus RTP (%)</label>

<input id="olympusRtp" type="number" value="${cfg.olympusRtp}">

</div>

<div class="formGroup">

<label>Lucky Slot Jackpot %</label>

<input id="slotJackpot" type="number" value="${cfg.slotJackpot}">

</div>

<div class="formGroup">

<label>Sweet Jackpot %</label>

<input id="sweetJackpot" type="number" value="${cfg.sweetJackpot}">

</div>

<div class="formGroup">

<label>Olympus Jackpot %</label>

<input id="olympusJackpot" type="number" value="${cfg.olympusJackpot}">

</div>

<div class="formGroup">

<label>Günlük Ödeme Limiti</label>

<input id="dailyLimit" type="number" value="${cfg.dailyLimit}">

</div>

<div class="formGroup">

<label>Tek Seferde Maksimum Kazanç</label>

<input id="maxWin" type="number" value="${cfg.maxWin}">

</div>

<div class="formGroup">

<label>House Edge (%)</label>

<input id="houseEdge" type="number" value="${cfg.houseEdge}">

</div>

</div>

<br>

<button class="btnAdmin"

onclick="Admin.saveCasinoSettings()">

💾 Kaydet

</button>

</div>

`;

},
   /*==================================
CASINO AYARLARINI KAYDET
==================================*/

saveCasinoSettings(){

const d=DB.load();

d.casinoConfig={

slotRtp:Number(slotRtp.value),

sweetRtp:Number(sweetRtp.value),

olympusRtp:Number(olympusRtp.value),

slotJackpot:Number(slotJackpot.value),

sweetJackpot:Number(sweetJackpot.value),

olympusJackpot:Number(olympusJackpot.value),

dailyLimit:Number(dailyLimit.value),

maxWin:Number(maxWin.value),

houseEdge:Number(houseEdge.value)

};

DB.save();

UI.toast(

"Casino ayarları kaydedildi",

"success"

);

},
   /*==================================
BANNER YÖNETİMİ
==================================*/

banner(){

const d=DB.load();

d.banners=d.banners||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>🖼️ Banner Yönetimi</h2>

<button
class="btnAdmin"
onclick="Admin.addBanner()">

+ Yeni Banner

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Başlık</th>

<th>Görsel</th>

<th>Durum</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${d.banners.map((b,i)=>`

<tr>

<td>${b.title}</td>

<td>${b.image}</td>

<td>

${b.active?

'<span class="badge badgeSuccess">Aktif</span>'

:

'<span class="badge badgeDanger">Pasif</span>'}

</td>

<td>

<button
class="btnAdmin"
onclick="Admin.editBanner(${i})">

Düzenle

</button>

<button
class="btnDanger"
onclick="Admin.deleteBanner(${i})">

Sil

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
YENİ BANNER
==================================*/

addBanner(){

const title=

prompt("Banner Başlığı");

if(!title) return;

const image=

prompt("Banner Resmi");

const d=DB.load();

d.banners=d.banners||[];

d.banners.push({

title,

image,

active:true

});

DB.save();

this.banner();

},
   /*==================================
BANNER DÜZENLE
==================================*/

editBanner(i){

const d=DB.load();

const b=d.banners[i];

if(!b) return;

b.title=

prompt(

"Başlık",

b.title

)||b.title;

b.image=

prompt(

"Görsel",

b.image

)||b.image;

b.active=

confirm(

"Banner aktif olsun mu?"

);

DB.save();

this.banner();

},

deleteBanner(i){

if(!confirm("Silinsin mi?")) return;

const d=DB.load();

d.banners.splice(i,1);

DB.save();

this.banner();

},
   /*==================================
HEDİYELER
==================================*/

gifts(){

const gifts=DB.allGifts();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🎁 Hediye Yönetimi

</h2>

<button

class="btnAdmin"

onclick="Admin.addGift()">

+ Yeni Hediye

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>İkon</th>

<th>Ad</th>

<th>Coin</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${gifts.map(g=>`

<tr>

<td>${g.icon}</td>

<td>${g.name}</td>

<td>${g.price}</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editGift('${g.id}')">

Düzenle

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
HEDİYE EKLE
==================================*/

addGift(){

const icon=

prompt("Emoji");

if(!icon) return;

const name=

prompt("Hediye Adı");

if(!name) return;

const price=

Number(

prompt("Coin")

);

const d=DB.load();

d.gifts.push({

id:"g"+Date.now(),

icon,

name,

price

});

DB.save();

this.gifts();

},
   /*==================================
HEDİYE DÜZENLE
==================================*/

editGift(id){

const d=DB.load();

const g=d.gifts.find(x=>x.id===id);

if(!g) return;

g.icon=

prompt(

"Emoji",

g.icon

)||g.icon;

g.name=

prompt(

"Ad",

g.name

)||g.name;

g.price=

Number(

prompt(

"Coin",

g.price

)

);

DB.save();

UI.toast(

"Hediye güncellendi",

"success"

);

this.gifts();

},
   /*==================================
COIN PAKETLERİ
==================================*/

wallet(){

const d=DB.load();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

💰 Coin Paketleri

</h2>

<button

class="btnAdmin"

onclick="Admin.addCoinPackage()">

+ Paket Ekle

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>ID</th>

<th>Coin</th>

<th>Fiyat</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${d.coinPackages.map(p=>`

<tr>

<td>${p.id}</td>

<td>${p.coin}</td>

<td>${p.price}</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editCoinPackage('${p.id}')">

Düzenle

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
PAKET EKLE
==================================*/

addCoinPackage(){

const coin=

Number(

prompt("Coin Miktarı")

);

if(!coin) return;

const price=

prompt("Fiyat");

const d=DB.load();

d.coinPackages.push({

id:"c"+Date.now(),

coin,

price

});

DB.save();

UI.toast(

"Paket eklendi",

"success"

);

this.wallet();

},
   /*==================================
PAKET DÜZENLE
==================================*/

editCoinPackage(id){

const d=DB.load();

const p=d.coinPackages.find(x=>x.id===id);

if(!p) return;

p.coin=

Number(

prompt(

"Coin",

p.coin

)

);

p.price=

prompt(

"Fiyat",

p.price

);

DB.save();

UI.toast(

"Paket güncellendi",

"success"

);

this.wallet();

},
   /*==================================
GÖREVLER
==================================*/

tasks(){

const d=DB.load();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

📅 Günlük Görev Yönetimi

</h2>

<button

class="btnAdmin"

onclick="Admin.addTask()">

+ Görev Ekle

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>ID</th>

<th>Görev</th>

<th>Ödül</th>

<th>Tür</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${d.dailyTasks.map(t=>`

<tr>

<td>${t.id}</td>

<td>${t.text}</td>

<td>${t.reward} Coin</td>

<td>${t.type}</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editTask('${t.id}')">

Düzenle

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
GÖREV EKLE
==================================*/

addTask(){

const text=

prompt("Görev");

if(!text) return;

const reward=

Number(

prompt("Ödül Coin")

);

const type=

prompt(

"Görev Türü",

"login"

);

const d=DB.load();

d.dailyTasks.push({

id:"t"+Date.now(),

text,

reward,

type

});

DB.save();

UI.toast(

"Görev eklendi",

"success"

);

this.tasks();

},
   /*==================================
GÖREV DÜZENLE
==================================*/

editTask(id){

const d=DB.load();

const t=d.dailyTasks.find(x=>x.id===id);

if(!t) return;

t.text=

prompt(

"Görev",

t.text

)||t.text;

t.reward=

Number(

prompt(

"Ödül",

t.reward

)

);

t.type=

prompt(

"Tür",

t.type

)||t.type;

DB.save();

UI.toast(

"Görev güncellendi",

"success"

);

this.tasks();

},
   /*==================================
AJANSLAR
==================================*/

agencies(){

const d=DB.load();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🏢 Ajans Yönetimi

</h2>

<button

class="btnAdmin"

onclick="Admin.addAgency()">

+ Yeni Ajans

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Ajans</th>

<th>Sahip</th>

<th>Yayıncı</th>

<th>Kazanç</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${d.agencies.map(a=>`

<tr>

<td>${a.name}</td>

<td>${a.ownerId}</td>

<td>${a.streamers.length}</td>

<td>${a.earnings}</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editAgency('${a.id}')">

Düzenle

</button>

<button

class="btnDanger"

onclick="Admin.deleteAgency('${a.id}')">

Sil

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
AJANS EKLE
==================================*/

addAgency(){

const name=

prompt("Ajans Adı");

if(!name) return;

const owner=

prompt("Sahip Kullanıcı ID");

const d=DB.load();

d.agencies.push({

id:"AG"+Date.now(),

name,

ownerId:owner,

streamers:[],

applications:[],

earnings:0,

announcements:[]

});

DB.save();

UI.toast(

"Ajans oluşturuldu",

"success"

);

this.agencies();

},
   /*==================================
AJANS DÜZENLE
==================================*/

editAgency(id){

const d=DB.load();

const a=d.agencies.find(x=>x.id===id);

if(!a) return;

a.name=

prompt(

"Ajans Adı",

a.name

)||a.name;

a.ownerId=

prompt(

"Sahip ID",

a.ownerId

)||a.ownerId;

a.earnings=

Number(

prompt(

"Kazanç",

a.earnings

)

);

DB.save();

UI.toast(

"Ajans güncellendi",

"success"

);

this.agencies();

},
   /*==================================
AJANS SİL
==================================*/

deleteAgency(id){

if(

!confirm(

"Ajans silinsin mi?"

)

){

return;

}

const d=DB.load();

d.agencies=

d.agencies.filter(

a=>a.id!==id

);

DB.save();

UI.toast(

"Ajans silindi",

"success"

);

this.agencies();

},

   /*==================================
VIP & NOBLE
==================================*/

vip(){

const users=DB.allUsers();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

👑 VIP & Noble Yönetimi

</h2>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Kullanıcı</th>

<th>VIP</th>

<th>Noble</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${users.map(u=>`

<tr>

<td>${u.username}</td>

<td>${u.vip}</td>

<td>${u.noble||0}</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editVip('${u.id}')">

Düzenle

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
VIP DÜZENLE
==================================*/

editVip(id){

const u=DB.getUser(id);

if(!u) return;

const vip=

Number(

prompt(

"VIP",

u.vip

)

);

const noble=

Number(

prompt(

"Noble",

u.noble||0

)

);

DB.updateUser(id,{

vip,

noble

});

UI.toast(

"VIP güncellendi",

"success"

);

this.vip();

},
   /*==================================
GLOBAL DUYURU
==================================*/

reports(){

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

📢 Global Duyuru

</h2>

<div class="formGroup">

<label>Başlık</label>

<input id="annTitle">

</div>

<div class="formGroup">

<label>Mesaj</label>

<textarea id="annText"></textarea>

</div>

<br>

<button

class="btnAdmin"

onclick="Admin.sendAnnouncement()">

Gönder

</button>

</div>

`;

},
   /*==================================
DUYURU GÖNDER
==================================*/

sendAnnouncement(){

const title=

annTitle.value;

const text=

annText.value;

DB.globalAnnounce(

title,

text

);

DB.allUsers().forEach(u=>{

DB.addNotification(

u.id,

title+" - "+text,

"system"

);

});

UI.toast(

"Duyuru gönderildi",

"success"

);

},
   /*==================================
MAĞAZA
==================================*/

shop(){

const d=DB.load();

d.shop=d.shop||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🛍️ Mağaza Yönetimi

</h2>

<button

class="btnAdmin"

onclick="Admin.addShopItem()">

+ Ürün Ekle

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Ürün</th>

<th>Tür</th>

<th>Fiyat</th>

<th>Süre</th>

<th>Durum</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${d.shop.map((i,index)=>`

<tr>

<td>${i.name}</td>

<td>${i.type}</td>

<td>${i.price}</td>

<td>${i.duration} Gün</td>

<td>

${i.active?

'<span class="badge badgeSuccess">Aktif</span>'

:

'<span class="badge badgeDanger">Pasif</span>'}

</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editShop(${index})">

Düzenle

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
ÜRÜN EKLE
==================================*/

addShopItem(){

const d=DB.load();

d.shop=d.shop||[];

const item={

name:prompt("Ürün Adı"),

type:prompt("Tür (frame/car/bubble/effect/avatar)"),

price:Number(prompt("Coin Fiyatı")),

duration:Number(prompt("Kaç Gün")),

active:true

};

d.shop.push(item);

DB.save();

UI.toast(

"Ürün eklendi",

"success"

);

this.shop();

},
   /*==================================
ÜRÜN DÜZENLE
==================================*/

editShop(index){

const d=DB.load();

const item=d.shop[index];

if(!item) return;

item.name=

prompt(

"Ürün",

item.name

)||item.name;

item.type=

prompt(

"Tür",

item.type

)||item.type;

item.price=

Number(

prompt(

"Coin",

item.price

)

);

item.duration=

Number(

prompt(

"Gün",

item.duration

)

);

item.active=

confirm(

"Ürün aktif olsun mu?"

);

DB.save();

UI.toast(

"Ürün güncellendi",

"success"

);

this.shop();

},
   /*==================================
SİSTEM AYARLARI
==================================*/

settings(){

const d=DB.load();

d.settings=d.settings||{

appName:"EY LIVE",

maintenance:false,

allowRegister:true,

allowRooms:true,

allowGames:true,

allowWithdraw:true,

welcomeMessage:"EY LIVE'a Hoşgeldiniz"

};

const s=d.settings;

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

⚙️ Sistem Ayarları

</h2>

<div class="formGrid">

<div class="formGroup">

<label>Uygulama Adı</label>

<input id="appName" value="${s.appName}">

</div>

<div class="formGroup">

<label>Hoşgeldin Mesajı</label>

<input id="welcomeMessage" value="${s.welcomeMessage}">

</div>

</div>

<div class="switchRow">

<span>Kayıt Olabilir</span>

<label class="switch">

<input id="allowRegister"

type="checkbox"

${s.allowRegister?"checked":""}>

<span class="slider"></span>

</label>

</div>

<div class="switchRow">

<span>Oda Açılabilir</span>

<label class="switch">

<input id="allowRooms"

type="checkbox"

${s.allowRooms?"checked":""}>

<span class="slider"></span>

</label>

</div>

<div class="switchRow">

<span>Casino Açık</span>

<label class="switch">

<input id="allowGames"

type="checkbox"

${s.allowGames?"checked":""}>

<span class="slider"></span>

</label>

</div>

<div class="switchRow">

<span>Diamond Çekimi</span>

<label class="switch">

<input id="allowWithdraw"

type="checkbox"

${s.allowWithdraw?"checked":""}>

<span class="slider"></span>

</label>

</div>

<div class="switchRow">

<span>Bakım Modu</span>

<label class="switch">

<input id="maintenance"

type="checkbox"

${s.maintenance?"checked":""}>

<span class="slider"></span>

</label>

</div>

<br>

<button

class="btnAdmin"

onclick="Admin.saveSettings()">

Kaydet

</button>

</div>

`;

},
   /*==================================
AYARLARI KAYDET
==================================*/

saveSettings(){

const d=DB.load();

d.settings={

appName:appName.value,

welcomeMessage:welcomeMessage.value,

allowRegister:allowRegister.checked,

allowRooms:allowRooms.checked,

allowGames:allowGames.checked,

allowWithdraw:allowWithdraw.checked,

maintenance:maintenance.checked

};

DB.save();

UI.toast(

"Sistem ayarları kaydedildi",

"success"

);

},
   /*==================================
ADMIN LOGLARI
==================================*/

logs(){

const logs=DB.allAdminLogs();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

📋 Admin Logları

</h2>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Tarih</th>

<th>İşlem</th>

<th>Hedef</th>

<th>Açıklama</th>

</tr>

</thead>

<tbody>

${logs.map(log=>`

<tr>

<td>

${new Date(log.ts).toLocaleString("tr-TR")}

</td>

<td>${log.action}</td>

<td>${log.target}</td>

<td>${log.note}</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
CANLI ODALAR
==================================*/

liveRooms(){

const rooms=DB.allRooms();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🎤 Canlı Oda Kontrol Merkezi

</h2>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Oda</th>

<th>Host</th>

<th>Mikrofon</th>

<th>Sohbet</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${rooms.map(r=>`

<tr>

<td>${r.name}</td>

<td>${r.hostId}</td>

<td>

${r.mics.filter(m=>m.userId).length}/12

</td>

<td>

${r.chat.length}

</td>

<td>

<button

class="btnDanger"

onclick="Admin.closeRoom('${r.id}')">

Kapat

</button>

<button

class="btnWarning"

onclick="Admin.clearRoomChat('${r.id}')">

Sohbeti Temizle

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
SOHBET TEMİZLE
==================================*/

clearRoomChat(id){

const room=DB.getRoom(id);

if(!room) return;

room.chat=[];

DB.save();

UI.toast(

"Oda sohbeti temizlendi",

"success"

);

this.liveRooms();

},
   /*==================================
YAYINCILAR
==================================*/

streamers(){

const users=DB.allUsers()

.filter(

u=>u.role==="streamer"

);

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🎙 Yayıncı Yönetimi

</h2>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Kullanıcı</th>

<th>Ajans</th>

<th>Coin</th>

<th>Diamond</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${users.map(u=>`

<tr>

<td>${u.username}</td>

<td>${u.agencyId||"-"}</td>

<td>${u.coin}</td>

<td>${u.diamond}</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editUser('${u.id}')">

Yönet

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
TOPLU BİLDİRİM
==================================*/

notifications(){

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🔔 Toplu Bildirim

</h2>

<div class="formGroup">

<label>Başlık</label>

<input id="pushTitle">

</div>

<div class="formGroup">

<label>Mesaj</label>

<textarea id="pushText"></textarea>

</div>

<br>

<button

class="btnAdmin"

onclick="Admin.sendPush()">

📤 Gönder

</button>

</div>

`;

},
   /*==================================
BİLDİRİM GÖNDER
==================================*/

sendPush(){

const title=pushTitle.value.trim();

const text=pushText.value.trim();

if(!title||!text){

UI.toast(

"Bilgileri doldurun",

"error"

);

return;

}

DB.allUsers().forEach(user=>{

DB.addNotification(

user.id,

title+" - "+text,

"push"

);

});

UI.toast(

"Tüm kullanıcılara gönderildi",

"success"

);

},
   /*==================================
FİNANS
==================================*/

finance(){

const d=DB.load();

const body=document.getElementById("dashboardContent");

const totalCoin=d.users.reduce((a,b)=>a+b.coin,0);

const totalDiamond=d.users.reduce((a,b)=>a+b.diamond,0);

const totalGift=d.walletTx
.filter(x=>x.type==="gift_sent")
.length;

body.innerHTML=`

<div class="statsGrid">

<div class="statBox">

<h4>

💰 Coin

</h4>

<h2>

${totalCoin.toLocaleString("tr-TR")}

</h2>

</div>

<div class="statBox">

<h4>

💎 Diamond

</h4>

<h2>

${totalDiamond.toLocaleString("tr-TR")}

</h2>

</div>

<div class="statBox">

<h4>

🎁 Gönderilen Hediye

</h4>

<h2>

${totalGift}

</h2>

</div>

<div class="statBox">

<h4>

👥 Kullanıcı

</h4>

<h2>

${d.users.length}

</h2>

</div>

</div>

`;

},
   /*==================================
AÇILIŞ REKLAMI
==================================*/

startupAd(){

const d=DB.load();

d.startupAd=d.startupAd||{

title:"",

image:"",

link:"",

active:false

};

const a=d.startupAd;

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

📢 Açılış Reklamı

</h2>

<div class="formGroup">

<label>Başlık</label>

<input id="adTitle"

value="${a.title}">

</div>

<div class="formGroup">

<label>Resim</label>

<input id="adImage"

value="${a.image}">

</div>

<div class="formGroup">

<label>Bağlantı</label>

<input id="adLink"

value="${a.link}">

</div>

<div class="switchRow">

<span>Aktif</span>

<label class="switch">

<input

id="adActive"

type="checkbox"

${a.active?"checked":""}>

<span class="slider"></span>

</label>

</div>

<br>

<button

class="btnAdmin"

onclick="Admin.saveStartupAd()">

Kaydet

</button>

</div>

`;

},
   /*==================================
AÇILIŞ REKLAMI KAYDET
==================================*/

saveStartupAd(){

const d=DB.load();

d.startupAd={

title:adTitle.value,

image:adImage.value,

link:adLink.value,

active:adActive.checked

};

DB.save();

UI.toast(

"Açılış reklamı kaydedildi",

"success"

);

},
   /*==================================
ETKİNLİKLER
==================================*/

events(){

const d=DB.load();

d.events=d.events||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🎉 Etkinlik Yönetimi

</h2>

<button

class="btnAdmin"

onclick="Admin.addEvent()">

+ Etkinlik Oluştur

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Başlık</th>

<th>Ödül</th>

<th>Durum</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${d.events.map((e,i)=>`

<tr>

<td>${e.title}</td>

<td>${e.reward}</td>

<td>

${e.active

?'<span class="badge badgeSuccess">Aktif</span>'

:'<span class="badge badgeDanger">Pasif</span>'}

</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editEvent(${i})">

Düzenle

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
ETKİNLİK EKLE
==================================*/

addEvent(){

const title=prompt("Etkinlik");

if(!title) return;

const reward=prompt("Ödül");

const d=DB.load();

d.events=d.events||[];

d.events.push({

title,

reward,

active:true

});

DB.save();

UI.toast(

"Etkinlik oluşturuldu",

"success"

);

this.events();

},
   /*==================================
ETKİNLİK DÜZENLE
==================================*/

editEvent(index){

const d=DB.load();

const e=d.events[index];

if(!e) return;

e.title=

prompt(

"Başlık",

e.title

)||e.title;

e.reward=

prompt(

"Ödül",

e.reward

)||e.reward;

e.active=

confirm(

"Etkinlik aktif mi?"

);

DB.save();

UI.toast(

"Güncellendi",

"success"

);

this.events();

},
   /*==================================
PROMOSYON
==================================*/

promoCodes(){

const d=DB.load();

d.promos=d.promos||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🎟 Promosyon Kodları

</h2>

<button

class="btnAdmin"

onclick="Admin.addPromo()">

+ Kod Oluştur

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Kod</th>

<th>Coin</th>

<th>Kullanım</th>

</tr>

</thead>

<tbody>

${d.promos.map(p=>`

<tr>

<td>${p.code}</td>

<td>${p.coin}</td>

<td>${p.used}</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
PROMOSYON EKLE
==================================*/

addPromo(){

const d=DB.load();

d.promos=d.promos||[];

d.promos.push({

code:

Math.random()

.toString(36)

.substring(2,10)

.toUpperCase(),

coin:Number(

prompt("Coin")

),

used:0

});

DB.save();

UI.toast(

"Kod oluşturuldu",

"success"

);

this.promoCodes();

},
   /*==================================
DİAMOND ÇEKİMLERİ
==================================*/

withdraws(){

const d=DB.load();

const body=document.getElementById("dashboardContent");

const list=d.walletTx.filter(

x=>x.type==="withdraw"

);

body.innerHTML=`

<div class="adminCard">

<h2>

💳 Diamond Çekim Talepleri

</h2>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Kullanıcı</th>

<th>Diamond</th>

<th>Tarih</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${list.map(w=>`

<tr>

<td>${w.userId}</td>

<td>${Math.abs(w.amount)}</td>

<td>${new Date(w.ts).toLocaleString("tr-TR")}</td>

<td>

<button

class="btnSuccess"

onclick="Admin.approveWithdraw('${w.id}')">

Onayla

</button>

<button

class="btnDanger"

onclick="Admin.rejectWithdraw('${w.id}')">

Reddet

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
ÇEKİM ONAY
==================================*/

approveWithdraw(id){

UI.toast(

"Çekim onaylandı",

"success"

);

DB.addAdminLog(

"withdraw",

id,

"Diamond çekimi onaylandı"

);

this.withdraws();

},

rejectWithdraw(id){

UI.toast(

"Çekim reddedildi",

"error"

);

DB.addAdminLog(

"withdraw",

id,

"Diamond çekimi reddedildi"

);

this.withdraws();

},
   /*==================================
BAKIM MODU
==================================*/

maintenance(){

const d=DB.load();

d.settings=d.settings||{};

d.settings.maintenance=

!d.settings.maintenance;

DB.save();

UI.toast(

d.settings.maintenance

?

"Bakım modu açıldı"

:

"Bakım modu kapatıldı",

"success"

);

},
   /*==================================
LİDERLİK
==================================*/

resetRanking(){

if(

!confirm(

"Haftalık sıralama sıfırlansın mı?"

)

)return;

DB.allUsers().forEach(u=>{

u.weekGift=0;

u.monthGift=0;

u.dayGift=0;

});

DB.save();

DB.addAdminLog(

"ranking",

"all",

"Liderlik sıfırlandı"

);

UI.toast(

"Sıralama sıfırlandı",

"success"

);

},
   /*==================================
MODERASYON
==================================*/

moderation(){

const users=DB.allUsers();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🛡 Moderasyon Merkezi

</h2>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Kullanıcı</th>

<th>Rol</th>

<th>Online</th>

<th>Ban</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${users.map(u=>`

<tr>

<td>${u.username}</td>

<td>${u.role}</td>

<td>

${u.online

?'<span class="badge badgeSuccess">Online</span>'

:'<span class="badge badgeDanger">Offline</span>'}

</td>

<td>

${u.banned

?'<span class="badge badgeDanger">Banlı</span>'

:'-'}

</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editUser('${u.id}')">

Yönet

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
GÜVENLİK
==================================*/

security(){

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🔒 Güvenlik Merkezi

</h2>

<div class="statsGrid">

<div class="statBox">

<h4>

Banlı Kullanıcı

</h4>

<h2>

${DB.stats().bannedUsers}

</h2>

</div>

<div class="statBox">

<h4>

Admin Log

</h4>

<h2>

${DB.allAdminLogs().length}

</h2>

</div>

<div class="statBox">

<h4>

Bildirim

</h4>

<h2>

${DB.load().notifications.length}

</h2>

</div>

<div class="statBox">

<h4>

Mesaj

</h4>

<h2>

${DB.load().conversations.length}

</h2>

</div>

</div>

</div>

`;

},
   /*==================================
SÜRÜM
==================================*/

version(){

const d=DB.load();

d.version=d.version||{

android:"1.0.0",

ios:"1.0.0",

force:false

};

const v=d.version;

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

📱 Sürüm Yönetimi

</h2>

<div class="formGrid">

<div class="formGroup">

<label>

Android

</label>

<input

id="androidVersion"

value="${v.android}">

</div>

<div class="formGroup">

<label>

iOS

</label>

<input

id="iosVersion"

value="${v.ios}">

</div>

</div>

<div class="switchRow">

<span>

Zorunlu Güncelleme

</span>

<label class="switch">

<input

id="forceUpdate"

type="checkbox"

${v.force?"checked":""}>

<span class="slider"></span>

</label>

</div>

<br>

<button

class="btnAdmin"

onclick="Admin.saveVersion()">

Kaydet

</button>

</div>

`;

},
   /*==================================
SÜRÜM KAYDET
==================================*/

saveVersion(){

const d=DB.load();

d.version={

android:androidVersion.value,

ios:iosVersion.value,

force:forceUpdate.checked

};

DB.save();

UI.toast(

"Sürüm güncellendi",

"success"

);

},
   /*==================================
BOT KULLANICILAR
==================================*/

bots(){

const d=DB.load();

d.bots=d.bots||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🤖 Bot Kullanıcı Yönetimi

</h2>

<button

class="btnAdmin"

onclick="Admin.addBot()">

+ Bot Oluştur

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Ad</th>

<th>Seviye</th>

<th>Durum</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${d.bots.map((b,i)=>`

<tr>

<td>${b.name}</td>

<td>${b.level}</td>

<td>

${b.active

?'<span class="badge badgeSuccess">Aktif</span>'

:'<span class="badge badgeDanger">Pasif</span>'}

</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editBot(${i})">

Düzenle

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
BOT EKLE
==================================*/

addBot(){

const d=DB.load();

d.bots=d.bots||[];

d.bots.push({

name:"Bot"+Math.floor(Math.random()*99999),

level:1,

coin:100000,

active:true

});

DB.save();

UI.toast(

"Bot oluşturuldu",

"success"

);

this.bots();

},
   /*==================================
BOT DÜZENLE
==================================*/

editBot(index){

const d=DB.load();

const bot=d.bots[index];

if(!bot) return;

bot.name=

prompt(

"Bot Adı",

bot.name

)||bot.name;

bot.level=

Number(

prompt(

"Seviye",

bot.level

)

);

bot.coin=

Number(

prompt(

"Coin",

bot.coin

)

);

bot.active=

confirm(

"Bot aktif olsun mu?"

);

DB.save();

UI.toast(

"Bot güncellendi",

"success"

);

this.bots();

},
   /*==================================
ÜLKELER
==================================*/

countries(){

const d=DB.load();

d.countries=d.countries||[

"Türkiye",

"Azerbaycan",

"Almanya",

"Fransa",

"İngiltere"

];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🌍 Ülke Yönetimi

</h2>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Ülke</th>

</tr>

</thead>

<tbody>

${d.countries.map(c=>`

<tr>

<td>${c}</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
GERÇEK ZAMANLI PANEL
==================================*/

realtime(){

const body=document.getElementById("dashboardContent");

const s=DB.stats();

body.innerHTML=`

<div class="statsGrid">

<div class="statBox">

<h4>👥 Online</h4>

<h2>${s.onlineUsers}</h2>

</div>

<div class="statBox">

<h4>🎤 Oda</h4>

<h2>${s.totalRooms}</h2>

</div>

<div class="statBox">

<h4>🏢 Ajans</h4>

<h2>${s.totalAgencies}</h2>

</div>

<div class="statBox">

<h4>🚫 Ban</h4>

<h2>${s.bannedUsers}</h2>

</div>

</div>

`;

},
   /*==================================
ROZETLER
==================================*/

badges(){

const d=DB.load();

d.badges=d.badges||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🏅 Rozet Yönetimi

</h2>

<button

class="btnAdmin"

onclick="Admin.addBadge()">

+ Rozet Ekle

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>İkon</th>

<th>Ad</th>

<th>Renk</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${d.badges.map((b,i)=>`

<tr>

<td>${b.icon}</td>

<td>${b.name}</td>

<td>${b.color}</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editBadge(${i})">

Düzenle

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
ROZET EKLE
==================================*/

addBadge(){

const d=DB.load();

d.badges=d.badges||[];

d.badges.push({

icon:"🏅",

name:"Yeni Rozet",

color:"#FFD700"

});

DB.save();

UI.toast(

"Rozet eklendi",

"success"

);

this.badges();

},
   /*==================================
ROZET DÜZENLE
==================================*/

editBadge(index){

const d=DB.load();

const b=d.badges[index];

if(!b) return;

b.icon=

prompt(

"Emoji",

b.icon

)||b.icon;

b.name=

prompt(

"Ad",

b.name

)||b.name;

b.color=

prompt(

"Renk",

b.color

)||b.color;

DB.save();

UI.toast(

"Rozet güncellendi",

"success"

);

this.badges();

},
   /*==================================
PROFİL ÇERÇEVELERİ
==================================*/

frames(){

const d=DB.load();

d.frames=d.frames||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🖼️ Profil Çerçeveleri

</h2>

<button

class="btnAdmin"

onclick="Admin.addFrame()">

+ Çerçeve

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Ad</th>

<th>Fiyat</th>

<th>Süre</th>

</tr>

</thead>

<tbody>

${d.frames.map(f=>`

<tr>

<td>${f.name}</td>

<td>${f.price}</td>

<td>${f.day} Gün</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
ÇERÇEVE EKLE
==================================*/

addFrame(){

const d=DB.load();

d.frames=d.frames||[];

d.frames.push({

name:"Yeni Çerçeve",

price:1000,

day:30

});

DB.save();

UI.toast(

"Çerçeve eklendi",

"success"

);

this.frames();

},
   /*==================================
ARAÇLAR
==================================*/

rides(){

const d=DB.load();

d.rides=d.rides||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🚗 Araç Yönetimi

</h2>

<button

class="btnAdmin"

onclick="Admin.addRide()">

+ Araç Ekle

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>İsim</th>

<th>Fiyat</th>

<th>Süre</th>

<th>Aktif</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${d.rides.map((r,i)=>`

<tr>

<td>${r.name}</td>

<td>${r.price}</td>

<td>${r.day} Gün</td>

<td>

${r.active

?'<span class="badge badgeSuccess">Aktif</span>'

:'<span class="badge badgeDanger">Pasif</span>'}

</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editRide(${i})">

Düzenle

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
ARAÇ EKLE
==================================*/

addRide(){

const d=DB.load();

d.rides=d.rides||[];

d.rides.push({

name:"Spor Araba",

price:25000,

day:30,

active:true

});

DB.save();

UI.toast(

"Araç eklendi",

"success"

);

this.rides();

},
   /*==================================
ARAÇ DÜZENLE
==================================*/

editRide(index){

const d=DB.load();

const r=d.rides[index];

if(!r) return;

r.name=

prompt(

"Araç Adı",

r.name

)||r.name;

r.price=

Number(

prompt(

"Coin",

r.price

)

);

r.day=

Number(

prompt(

"Gün",

r.day

)

);

r.active=

confirm(

"Aktif olsun mu?"

);

DB.save();

UI.toast(

"Araç güncellendi",

"success"

);

this.rides();

},
   /*==================================
SOHBET BALONLARI
==================================*/

bubbles(){

const d=DB.load();

d.bubbles=d.bubbles||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

💬 Sohbet Balonları

</h2>

<button

class="btnAdmin"

onclick="Admin.addBubble()">

+ Balon

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Ad</th>

<th>Coin</th>

<th>Süre</th>

</tr>

</thead>

<tbody>

${d.bubbles.map((b,i)=>`

<tr>

<td>${b.name}</td>

<td>${b.price}</td>

<td>${b.day} Gün</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
BALON EKLE
==================================*/

addBubble(){

const d=DB.load();

d.bubbles=d.bubbles||[];

d.bubbles.push({

name:"Mor Balon",

price:5000,

day:30

});

DB.save();

UI.toast(

"Balon eklendi",

"success"

);

this.bubbles();

},
   /*==================================
GİRİŞ EFEKTLERİ
==================================*/

entryEffects(){

const d=DB.load();

d.entryEffects=d.entryEffects||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

✨ Giriş Efektleri

</h2>

<button

class="btnAdmin"

onclick="Admin.addEntryEffect()">

+ Efekt Ekle

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Efekt</th>

<th>Coin</th>

<th>Süre</th>

<th>Durum</th>

</tr>

</thead>

<tbody>

${d.entryEffects.map((e,i)=>`

<tr>

<td>${e.name}</td>

<td>${e.price}</td>

<td>${e.day} Gün</td>

<td>

${e.active

?'<span class="badge badgeSuccess">Aktif</span>'

:'<span class="badge badgeDanger">Pasif</span>'}

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
EFEKT EKLE
==================================*/

addEntryEffect(){

const d=DB.load();

d.entryEffects=d.entryEffects||[];

d.entryEffects.push({

name:"Altın Giriş",

price:15000,

day:30,

active:true

});

DB.save();

UI.toast(

"Giriş efekti eklendi",

"success"

);

this.entryEffects();

},
   /*==================================
NOBLE
==================================*/

noble(){

const d=DB.load();

d.nobleLevels=d.nobleLevels||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

👑 Noble Yönetimi

</h2>

<button

class="btnAdmin"

onclick="Admin.addNoble()">

+ Noble

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Seviye</th>

<th>Ad</th>

<th>Coin</th>

<th>Aylık</th>

</tr>

</thead>

<tbody>

${d.nobleLevels.map((n,i)=>`

<tr>

<td>${n.level}</td>

<td>${n.name}</td>

<td>${n.coin}</td>

<td>${n.monthly}</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
NOBLE EKLE
==================================*/

addNoble(){

const d=DB.load();

d.nobleLevels=d.nobleLevels||[];

d.nobleLevels.push({

level:d.nobleLevels.length+1,

name:"Yeni Noble",

coin:50000,

monthly:true

});

DB.save();

UI.toast(

"Noble eklendi",

"success"

);

this.noble();

},
   /*==================================
SES EFEKTLERİ
==================================*/

voiceEffects(){

const d=DB.load();

d.voiceEffects=d.voiceEffects||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🎙️ Ses Efektleri

</h2>

<button

class="btnAdmin"

onclick="Admin.addVoiceEffect()">

+ Ses Efekti

</button>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Efekt</th>

<th>Coin</th>

<th>Süre</th>

</tr>

</thead>

<tbody>

${d.voiceEffects.map(v=>`

<tr>

<td>${v.name}</td>

<td>${v.price}</td>

<td>${v.day} Gün</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
SUPER ADMIN
==================================*/

permissions(){

const users=DB.allUsers();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🔐 Yetki Yönetimi

</h2>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Kullanıcı</th>

<th>Rol</th>

<th>Yetki</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${users.map(u=>`

<tr>

<td>${u.username}</td>

<td>${u.role}</td>

<td>${u.permission||"user"}</td>

<td>

<button

class="btnAdmin"

onclick="Admin.editPermission('${u.id}')">

Yetki Ver

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
YETKİ DEĞİŞTİR
==================================*/

editPermission(id){

const u=DB.getUser(id);

if(!u) return;

const permission=

prompt(

"superadmin / admin / moderator / user",

u.permission||u.role

);

DB.updateUser(id,{

permission

});

DB.addAdminLog(

"permission",

id,

permission

);

UI.toast(

"Yetki güncellendi",

"success"

);

this.permissions();

},
   /*==================================
ODA İZLE
==================================*/

watchRoom(id){

const room=DB.getRoom(id);

if(!room) return;

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🎤 ${room.name}

</h2>

<p>

Host :

${room.hostId}

</p>

<p>

Kategori :

${room.category}

</p>

<p>

Mikrofon :

${room.mics.filter(m=>m.userId).length}/12

</p>

<p>

Mesaj :

${room.chat.length}

</p>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Kullanıcı</th>

<th>Mesaj</th>

</tr>

</thead>

<tbody>

${room.chat.map(c=>`

<tr>

<td>${c.userId}</td>

<td>${c.text}</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

},
   /*==================================
EKONOMİ
==================================*/

economy(){

const d=DB.load();

d.economy=d.economy||{

giftTax:10,

withdrawTax:15,

agencyRate:20,

streamerRate:50,

eventBonus:0

};

const e=d.economy;

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

💰 Coin Ekonomisi

</h2>

<div class="formGrid">

<div class="formGroup">

<label>

Hediye Vergisi %

</label>

<input

id="giftTax"

type="number"

value="${e.giftTax}">

</div>

<div class="formGroup">

<label>

Diamond Çekim Vergisi %

</label>

<input

id="withdrawTax"

type="number"

value="${e.withdrawTax}">

</div>

<div class="formGroup">

<label>

Ajans Komisyon %

</label>

<input

id="agencyRate"

type="number"

value="${e.agencyRate}">

</div>

<div class="formGroup">

<label>

Yayıncı Payı %

</label>

<input

id="streamerRate"

type="number"

value="${e.streamerRate}">

</div>

<div class="formGroup">

<label>

Etkinlik Bonus %

</label>

<input

id="eventBonus"

type="number"

value="${e.eventBonus}">

</div>

</div>

<br>

<button

class="btnAdmin"

onclick="Admin.saveEconomy()">

Kaydet

</button>

</div>

`;

},
   /*==================================
EKONOMİ KAYDET
==================================*/

saveEconomy(){

const d=DB.load();

d.economy={

giftTax:Number(giftTax.value),

withdrawTax:Number(withdrawTax.value),

agencyRate:Number(agencyRate.value),

streamerRate:Number(streamerRate.value),

eventBonus:Number(eventBonus.value)

};

DB.save();

UI.toast(

"Ekonomi güncellendi",

"success"

);

},
   /*==================================
DATABASE YEDEKLE
==================================*/

backup(){

const data=JSON.stringify(DB.load(),null,2);

const blob=new Blob(

[data],

{

type:"application/json"

}

);

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="eylive-backup.json";

a.click();

URL.revokeObjectURL(url);

UI.toast(

"Yedek oluşturuldu",

"success"

);

},
   /*==================================
DATABASE GERİ YÜKLE
==================================*/

restore(file){

const reader=new FileReader();

reader.onload=e=>{

try{

const json=JSON.parse(e.target.result);

localStorage.setItem(

"eylive_db_v1",

JSON.stringify(json)

);

location.reload();

}catch{

UI.toast(

"Dosya hatalı",

"error"

);

}

};

reader.readAsText(file);

},
   /*==================================
CACHE TEMİZLE
==================================*/

clearCache(){

if(!confirm(

"Cache temizlensin mi?"

))

return;

localStorage.removeItem(

"eylive_cache"

);

sessionStorage.clear();

UI.toast(

"Cache temizlendi",

"success"

);

},
   /*==================================
SUNUCU DURUMU
==================================*/

server(){

const body=document.getElementById(

"dashboardContent"

);

body.innerHTML=`

<div class="statsGrid">

<div class="statBox">

<h4>

🟢 Sistem

</h4>

<h2>

AKTİF

</h2>

</div>

<div class="statBox">

<h4>

👥 Online

</h4>

<h2>

${DB.stats().onlineUsers}

</h2>

</div>

<div class="statBox">

<h4>

💾 Database

</h4>

<h2>

NORMAL

</h2>

</div>

<div class="statBox">

<h4>

⚡ Bellek

</h4>

<h2>

OK

</h2>

</div>

</div>

`;

},
   /*==================================
HIZLI İŞLEMLER
==================================*/

quickActions(){

return[

{

title:"👥 Kullanıcılar",

action:()=>this.users()

},

{

title:"🎤 Odalar",

action:()=>this.rooms()

},

{

title:"🏢 Ajanslar",

action:()=>this.agencies()

},

{

title:"🎁 Hediyeler",

action:()=>this.gifts()

},

{

title:"💰 Coin Paketleri",

action:()=>this.wallet()

},

{

title:"📅 Görevler",

action:()=>this.tasks()

},

{

title:"⚙ Sistem",

action:()=>this.settings()

},

{

title:"📊 İstatistik",

action:()=>this.dashboard()

}

];

},

/*==================================
ODA GEÇMİŞİ
==================================*/

roomHistory(){

const rooms=DB.allRooms();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

📜 Oda Geçmişi

</h2>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Oda</th>

<th>Host</th>

<th>Kuruluş</th>

<th>Mesaj</th>

<th>Mikrofon</th>

</tr>

</thead>

<tbody>

${rooms.map(r=>`

<tr>

<td>${r.name}</td>

<td>${r.hostId}</td>

<td>${new Date(r.createdAt).toLocaleString("tr-TR")}</td>

<td>${r.chat.length}</td>

<td>${r.mics.filter(x=>x.userId).length}</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
  /*==================================
KULLANICI ARAMA
==================================*/

searchUser(){

const keyword=prompt("ID / Telefon / Kullanıcı Adı");

if(!keyword) return;

const user=DB.getUserByPhoneOrUsername(keyword)
||DB.getUser(keyword);

if(!user){

UI.toast(

"Kullanıcı bulunamadı",

"error"

);

return;

}

this.editUser(user.id);

},
   /*==================================
HERKESİ ÇIKIŞ YAPTIR
==================================*/

logoutAll(){

if(!confirm(

"Tüm kullanıcılar çıkış yapsın mı?"

))

return;

DB.load().users.forEach(u=>{

u.online=false;

});

DB.save();

UI.toast(

"Tüm kullanıcılar çevrimdışı yapıldı",

"success"

);

},
   /*==================================
SUNUCU KİLİDİ
==================================*/

lockServer(){

const d=DB.load();

d.settings=d.settings||{};

d.settings.serverLocked=

!d.settings.serverLocked;

DB.save();

UI.toast(

d.settings.serverLocked

?

"Sunucu kilitlendi"

:

"Sunucu açıldı",

"success"

);

},
   /*==================================
ACİL DURUM
==================================*/

emergency(){

const body=document.getElementById(

"dashboardContent"

);

body.innerHTML=`

<div class="adminCard">

<h2>

🚨 Acil Durum

</h2>

<button

class="btnDanger"

onclick="Admin.lockServer()">

🔒 Sunucuyu Kilitle

</button>

<button

class="btnDanger"

onclick="Admin.logoutAll()">

👥 Herkesi Çıkış Yaptır

</button>

<button

class="btnDanger"

onclick="Admin.clearCache()">

🧹 Cache Temizle

</button>

<button

class="btnDanger"

onclick="Admin.backup()">

💾 Anlık Yedek

</button>

</div>

`;

},
   /*==================================
ŞİKAYETLER
==================================*/

reportsCenter(){

const d=DB.load();

d.reports=d.reports||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>🚨 Kullanıcı Şikayetleri</h2>

<div class="tableWrap">

<table class="adminTable">

<thead>

<tr>

<th>Tarih</th>

<th>Şikayet Eden</th>

<th>Şikayet Edilen</th>

<th>Sebep</th>

<th>Durum</th>

</tr>

</thead>

<tbody>

${d.reports.map((r,i)=>`

<tr>

<td>${new Date(r.ts).toLocaleString()}</td>

<td>${r.from}</td>

<td>${r.to}</td>

<td>${r.reason}</td>

<td>

<button

class="btnAdmin"

onclick="Admin.closeReport(${i})">

Kapat

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
ŞİKAYET KAPAT
==================================*/

closeReport(index){

const d=DB.load();

d.reports.splice(index,1);

DB.save();

UI.toast(

"Şikayet kapatıldı",

"success"

);

this.reportsCenter();

},
   /*==================================
YASAKLI KELİMELER
==================================*/

badWords(){

const d=DB.load();

d.badWords=d.badWords||[];

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>🚫 Yasaklı Kelimeler</h2>

<button

class="btnAdmin"

onclick="Admin.addBadWord()">

+ Kelime

</button>

<div class="tableWrap">

<table class="adminTable">

<tbody>

${d.badWords.map((w,i)=>`

<tr>

<td>${w}</td>

<td>

<button

class="btnDanger"

onclick="Admin.removeBadWord(${i})">

Sil

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

},
   /*==================================
KELİME EKLE
==================================*/

addBadWord(){

const word=prompt(

"Yasaklı Kelime"

);

if(!word) return;

const d=DB.load();

d.badWords.push(word);

DB.save();

this.badWords();

},

removeBadWord(index){

const d=DB.load();

d.badWords.splice(index,1);

DB.save();

this.badWords();

},
   /*==================================
SİSTEM BİLGİSİ
==================================*/

systemInfo(){

const s=DB.stats();

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="statsGrid">

<div class="statBox">

<h4>👥 Kullanıcı</h4>

<h2>${s.totalUsers}</h2>

</div>

<div class="statBox">

<h4>🎤 Oda</h4>

<h2>${s.totalRooms}</h2>

</div>

<div class="statBox">

<h4>🏢 Ajans</h4>

<h2>${s.totalAgencies}</h2>

</div>

<div class="statBox">

<h4>💰 Coin</h4>

<h2>${s.totalCoin.toLocaleString()}</h2>

</div>

<div class="statBox">

<h4>💎 Diamond</h4>

<h2>${s.totalDiamond.toLocaleString()}</h2>

</div>

<div class="statBox">

<h4>🟢 Online</h4>

<h2>${s.onlineUsers}</h2>

</div>

</div>

`;

},
   /*==================================
SYSTEM HEALTH
==================================*/

health(){

const d=DB.load();

const body=document.getElementById("dashboardContent");

const errors=[];

if(!d.users.length) errors.push("Kullanıcı bulunamadı");

if(!d.rooms.length) errors.push("Oda bulunamadı");

if(!d.gifts.length) errors.push("Hediye listesi boş");

if(!d.coinPackages.length) errors.push("Coin paketi yok");

body.innerHTML=`

<div class="adminCard">

<h2>🩺 Sistem Sağlığı</h2>

${errors.length?

errors.map(x=>`

<div class="alert alertDanger">

${x}

</div>

`).join("")

:

`

<div class="alert alertSuccess">

Sistem sağlıklı çalışıyor.

</div>

`

}

</div>

`;

},
   /*==================================
ONLINE KULLANICILAR
==================================*/

onlineUsers(){

const users=

DB.allUsers()

.filter(

u=>u.online

);

const body=document.getElementById("dashboardContent");

body.innerHTML=`

<div class="adminCard">

<h2>

🟢 Online Kullanıcılar

</h2>

<table class="adminTable">

<thead>

<tr>

<th>ID</th>

<th>Kullanıcı</th>

<th>Rol</th>

<th>İşlem</th>

</tr>

</thead>

<tbody>

${users.map(u=>`

<tr>

<td>${u.id}</td>

<td>${u.username}</td>

<td>${u.role}</td>

<td>

<button

class="btnDanger"

onclick="Admin.forceLogout('${u.id}')">

Çıkart

</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

},
   /*==================================
ZORLA ÇIKIŞ
==================================*/

forceLogout(id){

DB.updateUser(id,{

online:false

});

DB.addNotification(

id,

"Oturumunuz yönetici tarafından sonlandırıldı.",

"system"

);

UI.toast(

"Kullanıcı çıkış yaptı",

"success"

);

this.onlineUsers();

},
   /*==================================
SUNUCU MESAJI
==================================*/

broadcast(){

const msg=

prompt(

"Tüm kullanıcılara gönderilecek mesaj"

);

if(!msg) return;

DB.allUsers().forEach(u=>{

DB.addNotification(

u.id,

msg,

"broadcast"

);

});

DB.addAdminLog(

"broadcast",

"all",

msg

);

UI.toast(

"Mesaj gönderildi",

"success"

);

},
   /*==================================
SİSTEMİ YENİLE
==================================*/

reloadSystem(){

if(

!confirm(

"Sistem yeniden yüklensin mi?"

)

)

return;

location.reload();

}

};

})();

