import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {

doc,
getDoc,
setDoc,
updateDoc,
collection,
getDocs,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

/*==================================
ELEMENTLER
==================================*/

const candyEnabled=document.getElementById("candyEnabled");
const candyRtp=document.getElementById("candyRtp");
const candyMin=document.getElementById("candyMin");
const candyMax=document.getElementById("candyMax");
const candyMultiplier=document.getElementById("candyMultiplier");
const saveCandy=document.getElementById("saveCandy");

const olympusEnabled=document.getElementById("olympusEnabled");
const olympusRtp=document.getElementById("olympusRtp");
const olympusMin=document.getElementById("olympusMin");
const olympusMax=document.getElementById("olympusMax");
const olympusMultiplier=document.getElementById("olympusMultiplier");
const olympusFree=document.getElementById("olympusFree");
const saveOlympus=document.getElementById("saveOlympus");

const todaySpin=document.getElementById("todaySpin");
const todayIncome=document.getElementById("todayIncome");
const todayPayout=document.getElementById("todayPayout");
const casinoProfit=document.getElementById("casinoProfit");

/*==================================
AUTH
==================================*/

let admin=null;

onAuthStateChanged(auth,async(user)=>{

    if(!user){

        location.href="../login.html";

        return;

    }

    admin=user;

    await checkAdmin();

});
/*==================================
ADMIN KONTROLÜ
==================================*/

async function checkAdmin() {

    try {

        const adminRef = doc(db, "users", admin.uid);

        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {

            location.href = "../home.html";

            return;

        }

        const data = adminSnap.data();

        if (
            data.role !== "admin" &&
            data.role !== "superAdmin"
        ) {

            alert("Bu sayfaya erişim yetkiniz yok.");

            location.href = "../home.html";

            return;

        }

        await loadCasinoSettings();

        await loadDashboard();

    } catch (e) {

        console.error(e);

    }

}

/*==================================
CASINO AYARLARI
==================================*/

async function loadCasinoSettings() {

    try {

        // EY Candy

        const candyRef = doc(db, "casino", "candy");

        const candySnap = await getDoc(candyRef);

        if (candySnap.exists()) {

            const candy = candySnap.data();

            candyEnabled.checked = candy.enabled;

            candyRtp.value = candy.rtp;

            candyMin.value = candy.minBet;

            candyMax.value = candy.maxBet;

            candyMultiplier.value = candy.maxMultiplier;

        }

        // EY Olympus

        const olympusRef = doc(db, "casino", "olympus");

        const olympusSnap = await getDoc(olympusRef);

        if (olympusSnap.exists()) {

            const game = olympusSnap.data();

            olympusEnabled.checked = game.enabled;

            olympusRtp.value = game.rtp;

            olympusMin.value = game.minBet;

            olympusMax.value = game.maxBet;

            olympusMultiplier.value = game.maxMultiplier;

            olympusFree.value = game.freeSpin;

        }

    } catch (e) {

        console.error(e);

    }

}
/*==================================
DASHBOARD
==================================*/

async function loadDashboard() {

    try {

        const statsRef = doc(db, "casino", "statistics");

        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists()) {

            const stats = statsSnap.data();

            todaySpin.textContent =
                Number(stats.todaySpin || 0).toLocaleString("tr-TR");

            todayIncome.textContent =
                Number(stats.todayIncome || 0).toLocaleString("tr-TR");

            todayPayout.textContent =
                Number(stats.todayPayout || 0).toLocaleString("tr-TR");

            const profit =
                (stats.todayIncome || 0) -
                (stats.todayPayout || 0);

            casinoProfit.textContent =
                profit.toLocaleString("tr-TR");

        }

        await loadLivePlayers();

        await loadRecentSpins();

    } catch (err) {

        console.error(err);

    }

}

/*==================================
AKTİF OYUNCULAR
==================================*/

async function loadLivePlayers() {

    try {

        const users = await getDocs(collection(db, "users"));

        let online = 0;

        users.forEach(user => {

            const data = user.data();

            if (data.online === true) {

                online++;

            }

        });

        const onlineBox =
            document.getElementById("onlinePlayers");

        if (onlineBox) {

            onlineBox.textContent = online;

        }

    } catch (err) {

        console.error(err);

    }

}

/*==================================
CASINO KÂRI
==================================*/

function updateProfitColor() {

    const value =
        Number(
            casinoProfit.textContent.replace(/\./g, "")
        );

    if (value >= 0) {

        casinoProfit.classList.remove("loss");

        casinoProfit.classList.add("profit");

    } else {

        casinoProfit.classList.remove("profit");

        casinoProfit.classList.add("loss");

    }

}

updateProfitColor();
/*==================================
CANLI SPIN KAYITLARI
==================================*/

import {
    query,
    orderBy,
    limit,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const spinLog = document.getElementById("spinLog");

function loadRecentSpins() {

    const q = query(
        collection(db, "casinoSpins"),
        orderBy("createdAt", "desc"),
        limit(50)
    );

    onSnapshot(q, (snapshot) => {

        if (!spinLog) return;

        spinLog.innerHTML = "";

        snapshot.forEach((docSnap) => {

            const spin = docSnap.data();

            const item = document.createElement("div");

            item.className = "spinItem";

            const amount = Number(spin.winAmount || 0);

            item.innerHTML = `

                <div>

                    <div class="spinPlayer">
                        ${spin.nickname || "Oyuncu"}
                    </div>

                    <div class="spinGame">
                        ${spin.game || "EY Candy"}
                    </div>

                </div>

                <div class="${
                    amount > 0 ? "spinWin" : "spinLose"
                }">

                    ${
                        amount > 0
                        ? "+" + amount.toLocaleString("tr-TR")
                        : "-" + Number(spin.bet || 0).toLocaleString("tr-TR")
                    }

                </div>

            `;

            spinLog.appendChild(item);

        });

    });

}

/*==================================
SON GÜNCELLEME
==================================*/

function updateLastRefresh(){

    const now = new Date();

    const el = document.getElementById("lastRefresh");

    if(!el) return;

    el.innerHTML =
        now.toLocaleTimeString("tr-TR");

}

setInterval(updateLastRefresh,1000);
updateLastRefresh();
/*==================================
OYUNCU ARAMA
==================================*/

const searchPlayer =
document.getElementById("searchPlayer");

const findPlayer =
document.getElementById("findPlayer");

const playerResult =
document.getElementById("playerResult");

const casinoBan =
document.getElementById("casinoBan");

const dailyLimit =
document.getElementById("dailyLimit");

const playerMaxBet =
document.getElementById("playerMaxBet");

const savePlayer =
document.getElementById("savePlayer");

let selectedPlayer=null;

findPlayer?.addEventListener("click",searchUser);

async function searchUser(){

try{

const keyword=searchPlayer.value.trim();

if(keyword==="") return;

playerResult.innerHTML="Aranıyor...";

const users=await getDocs(collection(db,"users"));

let found=false;

users.forEach(docSnap=>{

const data=docSnap.data();

if(

data.uid===keyword ||

String(data.userId)===keyword ||

data.nickname?.toLowerCase()===keyword.toLowerCase()

){

found=true;

selectedPlayer=docSnap.id;

casinoBan.checked=data.casinoBan||false;

dailyLimit.value=data.dailyCasinoLimit||500000;

playerMaxBet.value=data.maxCasinoBet||100000;

playerResult.innerHTML=`

<div class="playerCard">

<div class="playerHeader">

<img
class="playerAvatar"
src="${data.avatar}">

<div class="playerInfo">

<h2>${data.nickname}</h2>

<p>ID : ${data.userId}</p>

</div>

</div>

<div class="playerGrid">

<div class="playerBox">

<h3>${Number(data.coins||0).toLocaleString("tr-TR")}</h3>

<span>Coin</span>

</div>

<div class="playerBox">

<h3>${Number(data.diamonds||0).toLocaleString("tr-TR")}</h3>

<span>Diamond</span>

</div>

<div class="playerBox">

<h3>${data.followers||0}</h3>

<span>Takipçi</span>

</div>

<div class="playerBox">

<h3>${data.level||1}</h3>

<span>Seviye</span>

</div>

</div>

</div>

`;

}

});

if(!found){

playerResult.innerHTML="Oyuncu bulunamadı.";

}

}catch(e){

console.error(e);

}

}

/*==================================
OYUNCU AYARLARI
==================================*/

savePlayer?.addEventListener("click",savePlayerSettings);

async function savePlayerSettings(){

if(!selectedPlayer){

alert("Önce oyuncu seç.");

return;

}

try{

await updateDoc(

doc(db,"users",selectedPlayer),

{

casinoBan:casinoBan.checked,

dailyCasinoLimit:Number(dailyLimit.value),

maxCasinoBet:Number(playerMaxBet.value),

updatedAt:serverTimestamp()

}

);

alert("Oyuncu ayarları kaydedildi.");

}catch(e){

console.error(e);

}

}
/*==================================
OYUN AYARLARINI KAYDET
==================================*/

saveCandy?.addEventListener("click", saveCandySettings);

async function saveCandySettings(){

    try{

        await setDoc(
            doc(db,"casino","candy"),
            {

                enabled:candyEnabled.checked,

                rtp:Number(candyRtp.value),

                minBet:Number(candyMin.value),

                maxBet:Number(candyMax.value),

                maxMultiplier:Number(candyMultiplier.value),

                updatedBy:admin.uid,

                updatedAt:serverTimestamp()

            },
            {merge:true}
        );

        alert("EY Candy ayarları kaydedildi.");

    }catch(err){

        console.error(err);

    }

}

/*==================================
EY OLYMPUS
==================================*/

saveOlympus?.addEventListener("click",saveOlympusSettings);

async function saveOlympusSettings(){

    try{

        await setDoc(
            doc(db,"casino","olympus"),
            {

                enabled:olympusEnabled.checked,

                rtp:Number(olympusRtp.value),

                minBet:Number(olympusMin.value),

                maxBet:Number(olympusMax.value),

                maxMultiplier:Number(olympusMultiplier.value),

                freeSpin:Number(olympusFree.value),

                updatedBy:admin.uid,

                updatedAt:serverTimestamp()

            },
            {merge:true}
        );

        alert("EY Olympus ayarları kaydedildi.");

    }catch(err){

        console.error(err);

    }

}

/*==================================
LUCKY WHEEL
==================================*/

const wheelEnabled=document.getElementById("wheelEnabled");
const wheelDaily=document.getElementById("wheelDaily");
const wheelMin=document.getElementById("wheelMin");
const wheelMax=document.getElementById("wheelMax");
const saveWheel=document.getElementById("saveWheel");

saveWheel?.addEventListener("click",async()=>{

    try{

        await setDoc(
            doc(db,"casino","wheel"),
            {

                enabled:wheelEnabled.checked,

                dailySpin:Number(wheelDaily.value),

                minReward:Number(wheelMin.value),

                maxReward:Number(wheelMax.value),

                updatedBy:admin.uid,

                updatedAt:serverTimestamp()

            },
            {merge:true}
        );

        alert("Lucky Wheel
              /*==================================
EVENT SYSTEM
==================================*/

const eventName=document.getElementById("eventName");
const eventMultiplier=document.getElementById("eventMultiplier");
const eventStart=document.getElementById("eventStart");
const eventEnd=document.getElementById("eventEnd");
const saveEvent=document.getElementById("saveEvent");

saveEvent?.addEventListener("click",saveCasinoEvent);

async function saveCasinoEvent(){

    try{

        await setDoc(

            doc(db,"casino","event"),

            {

                enabled:true,

                title:eventName.value,

                multiplier:Number(eventMultiplier.value),

                start:eventStart.value,

                end:eventEnd.value,

                updatedBy:admin.uid,

                updatedAt:serverTimestamp()

            },

            {merge:true}

        );

        alert("Etkinlik kaydedildi.");

    }

    catch(e){

        console.error(e);

    }

}

/*==================================
BAKIM MODU
==================================*/

const maintenance=
document.getElementById("maintenance");

const saveMaintenance=
document.getElementById("saveMaintenance");

saveMaintenance?.addEventListener(

"click",

async()=>{

try{

await setDoc(

doc(db,"casino","maintenance"),

{

enabled:maintenance.checked,

updatedBy:admin.uid,

updatedAt:serverTimestamp()

},

{merge:true}

);

alert("Bakım modu güncellendi.");

}catch(e){

console.error(e);

}

});

/*==================================
CASINO DUYURUSU
==================================*/

async function sendCasinoAnnouncement(title,message){

try{

await setDoc(

doc(db,"casino","announcement"),

{

title,

message,

createdAt:serverTimestamp(),

createdBy:admin.uid

},

{merge:true}

);

}catch(e){

console.error(e);

}

}

/*==================================
OYUN AKTİF Mİ?
==================================*/

async function isGameEnabled(game){

const ref=doc(db,"casino",game);

const snap=await getDoc(ref);
  /*==================================
CANLI AYAR SENKRONİZASYONU
==================================*/

import {
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

/*==================================
EY CANDY
==================================*/

onSnapshot(

doc(db,"casino","candy"),

(snapshot)=>{

if(!snapshot.exists()) return;

const data=snapshot.data();

candyEnabled.checked=data.enabled;

candyRtp.value=data.rtp;

candyMin.value=data.minBet;

candyMax.value=data.maxBet;

candyMultiplier.value=data.maxMultiplier;

}

/*==================================
EY OLYMPUS
==================================*/

);

onSnapshot(

doc(db,"casino","olympus"),

(snapshot)=>{

if(!snapshot.exists()) return;

const data=snapshot.data();

olympusEnabled.checked=data.enabled;

olympusRtp.value=data.rtp;

olympusMin.value=data.minBet;

olympusMax.value=data.maxBet;

olympusMultiplier.value=data.maxMultiplier;

olympusFree.value=data.freeSpin;

}

);

/*==================================
LUCKY WHEEL
==================================*/

onSnapshot(

doc(db,"casino","wheel"),

(snapshot)=>{

if(!snapshot.exists()) return;

const data=snapshot.data();

wheelEnabled.checked=data.enabled;

wheelDaily.value=data.dailySpin;

wheelMin.value=data.minReward;

wheelMax.value=data.maxReward;

}

);

/*==================================
DIAMOND SPIN
==================================*/

onSnapshot(

doc(db,"casino","diamond"),

(snapshot)=>{

if(!snapshot.exists()) return;

const data=snapshot.data();

diamondEnabled.checked=data.enabled;

diamondMin.value=data.minBet;

diamondMax.value=data.maxBet;

diamondPrize.value=data.diamondPrize;

}

);

/*==================================
CASINO BAKIM MODU
==================================*/

onSnapshot(

doc(db,"casino","maintenance"),

(snapshot)=>{

if(!snapshot.exists()) return;

maintenance.checked=snapshot.data().enabled;

}

);

/*==================================
CASINO ETKİNLİĞİ
==================================*/

onSnapshot(

doc(db,"casino","event"),

(snapshot)=>{

if(!snapshot.exists()) return;

const data=snapshot.data();

eventName.value=data.title;

eventMultiplier.value=data.multiplier;

eventStart.value=data.start;

eventEnd.value=data.end;

}

);
  /*==================================
GÜNLÜK RAPOR
==================================*/

const reportBtn=document.getElementById("reportBtn");

reportBtn?.addEventListener("click",generateCasinoReport);

async function generateCasinoReport(){

try{

const report={

date:new Date().toLocaleDateString("tr-TR"),

todaySpin:Number(todaySpin.textContent.replace(/\./g,"")),

todayIncome:Number(todayIncome.textContent.replace(/\./g,"")),

todayPayout:Number(todayPayout.textContent.replace(/\./g,"")),

profit:Number(casinoProfit.textContent.replace(/\./g,""))

};

await setDoc(

doc(
db,
"casinoReports",
Date.now().toString()
),

{

...report,

createdAt:serverTimestamp(),

createdBy:admin.uid

}

);

alert("Casino raporu oluşturuldu.");

}catch(e){

console.error(e);

}

}

/*==================================
İSTATİSTİK SIFIRLAMA
==================================*/

const resetStats=document.getElementById("resetStats");

resetStats?.addEventListener("click",resetCasinoStatistics);

async function resetCasinoStatistics(){

const ok=confirm(
"Bugünkü istatistikler sıfırlansın mı?"
);

if(!ok) return;

try{

await updateDoc(

doc(db,"casino","statistics"),

{

todaySpin:0,

todayIncome:0,

todayPayout:0,

updatedAt:serverTimestamp(),

updatedBy:admin.uid

}

);

alert("İstatistikler sıfırlandı.");

}catch(e){

console.error(e);

}

}

/*==================================
CASINO LOG
==================================*/

async function addCasinoLog(action){

try{

await setDoc(

doc(

collection(db,"casinoLogs")

),

{

action,

admin:admin.uid,

createdAt:serverTimestamp()

}

);

}catch(e){

console.error(e);

}

}

/*==================================
LOG KULLANIMI
==================================*/

saveCandy?.addEventListener("click",()=>{

addCasinoLog("EY Candy ayarları değiştirildi");

});

saveOlympus?.addEventListener("click",()=>{

addCasinoLog("EY Olympus ayarları değiştirildi");

});

saveWheel?.addEventListener("click",()=>{

addCasinoLog("Lucky Wheel ayarları değiştirildi");

});

saveDiamond?.addEventListener("click",()=>{

addCasinoLog("Diamond Spin ayarları değiştirildi");

});
  /*==================================
SUPER ADMIN
==================================*/

let currentRole="user";

async function loadAdminRole(){

    try{

        const snap=await getDoc(
            doc(db,"users",admin.uid)
        );

        if(!snap.exists()) return;

        currentRole=snap.data().role || "user";

        if(currentRole==="superAdmin"){

            document.body.classList.add("super-admin");

        }

    }catch(err){

        console.error(err);

    }

}

/*==================================
ACİL CASINO KAPAT
==================================*/

const emergencyBtn=document.getElementById("emergencyStop");

emergencyBtn?.addEventListener("click",async()=>{

    if(currentRole!=="superAdmin"){

        alert("Sadece Super Admin kullanabilir.");

        return;

    }

    const ok=confirm(
        "Tüm casino oyunları kapatılsın mı?"
    );

    if(!ok) return;

    const games=[
        "candy",
        "olympus",
        "wheel",
        "diamond"
    ];

    for(const game of games){

        await updateDoc(
            doc(db,"casino",game),
            {
                enabled:false,
                maintenance:true,
                updatedBy:admin.uid,
                updatedAt:serverTimestamp()
            }
        );

    }

    await addCasinoLog(
        "ACİL CASINO KAPATILDI"
    );

    alert("Casino durduruldu.");

});

/*==================================
PERFORMANS
==================================*/

setInterval(()=>{

    loadDashboard();

},30000);

/*==================================
ROL YÜKLE
==================================*/

loadAdminRole();

/*==================================
BAŞLAT
==================================*/

console.log("EY LIVE Casino Panel Hazır");
