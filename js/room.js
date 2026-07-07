/* ==========================================
   EY LIVE
   ROOM SYSTEM
========================================== */

const ROOM = {

id: "ROOM100001",

name: "Türkiye Lounge",

owner: "EY100000001",

host: "EY LIVE",

online: 286,

locked: false,

maxMic: 16,

};

const currentUser = JSON.parse(

localStorage.getItem("eylive_user")

);

const roomUsers = [];

const roomModerators = [];

const roomCoHosts = [];

const roomBanList = [];

const micSeats = [];

for(let i=1;i<=ROOM.maxMic;i++){

micSeats.push({

seat:i,

user:null,

locked:false,

mute:false

});

}

/* ===========================
ROOM LOAD
=========================== */

window.onload=()=>{

loadRoom();

loadSeats();

loadOnline();

};

/* ===========================
ROOM INFO
=========================== */

function loadRoom(){

document.getElementById("roomName").innerHTML=

ROOM.name;

document.getElementById("roomId").innerHTML=

ROOM.id;

document.getElementById("onlineCount").innerHTML=

ROOM.online;

document.getElementById("hostName").innerHTML=

ROOM.host;

}

/* ===========================
MIC LOAD
=========================== */

function loadSeats(){

document

.querySelectorAll(".micSeat")

.forEach((seat,index)=>{

seat.dataset.seat=index+1;

seat.onclick=()=>{

openSeat(index+1);

};

});

}

/* ===========================
CLICK SEAT
=========================== */

function openSeat(seat){

if(isOwner()){

openOwnerSeatMenu(seat);

return;

}

if(isModerator()){

openModeratorSeatMenu(seat);

return;

}

requestMic(seat);

}
/* ===========================
PERMISSION SYSTEM
=========================== */

function isOwner(){

    if(!currentUser) return false;

    return currentUser.id===ROOM.owner;

}

function isModerator(){

    if(!currentUser) return false;

    return roomModerators.includes(currentUser.id);

}

function isCoHost(){

    if(!currentUser) return false;

    return roomCoHosts.includes(currentUser.id);

}

/* ===========================
OWNER MENU
=========================== */

function openOwnerSeatMenu(seat){

    const action=prompt(

`Koltuk ${seat}

1 Mikrofon Aç

2 Mikrofon Kapat

3 Kilitle

4 Kilidi Aç

5 Kullanıcı Al

6 Kullanıcı İndir`

    );

    switch(action){

        case "1":

            micSeats[seat-1].mute=false;

            toast("🎤 Mikrofon açıldı");

        break;

        case "2":

            micSeats[seat-1].mute=true;

            toast("🔇 Mikrofon kapatıldı");

        break;

        case "3":

            micSeats[seat-1].locked=true;

            toast("🔒 Mikrofon kilitlendi");

        break;

        case "4":

            micSeats[seat-1].locked=false;

            toast("🔓 Mikrofon açıldı");

        break;

        case "5":

            inviteUserToSeat(seat);

        break;

        case "6":

            removeSeatUser(seat);

        break;

    }

}

/* ===========================
MODERATOR MENU
=========================== */

function openModeratorSeatMenu(seat){

    const action=prompt(

`Koltuk ${seat}

1 Mikrofon Aç

2 Mikrofon Kapat

3 Kullanıcı İndir`

    );

    switch(action){

        case "1":

            micSeats[seat-1].mute=false;

            toast("🎤 Mikrofon açıldı");

        break;

        case "2":

            micSeats[seat-1].mute=true;

            toast("🔇 Mikrofon kapandı");

        break;

        case "3":

            removeSeatUser(seat);

        break;

    }

}

/* ===========================
REQUEST MIC
=========================== */

function requestMic(seat){

    if(micSeats[seat-1].locked){

        toast("🔒 Mikrofon kilitli");

        return;

    }

    toast("✋ Mikrofon isteği gönderildi");

}

/* ===========================
INVITE USER
=========================== */

function inviteUserToSeat(seat){

    toast("👤 Kullanıcı davet edildi");

}

/* ===========================
REMOVE USER
=========================== */

function removeSeatUser(seat){

    micSeats[seat-1].user=null;

    toast("⬇ Kullanıcı mikrofondan indirildi");

}

/* ===========================
TOAST
=========================== */

function toast(text){

    let div=document.createElement("div");

    div.className="toast";

    div.innerHTML=text;

    document.body.appendChild(div);

    setTimeout(()=>{

        div.classList.add("show");

    },50);

    setTimeout(()=>{

        div.remove();

    },2500);

}
/* ==========================================
   EY LIVE
   ROOM MANAGEMENT
========================================== */

/* ===========================
MIC REQUEST QUEUE
=========================== */

const micRequests = [];

function sendMicRequest() {

    if (!currentUser) return;

    if (micRequests.find(x => x.id === currentUser.id)) {

        toast("✋ Zaten isteğiniz bekliyor.");

        return;

    }

    micRequests.push({

        id: currentUser.id,

        username: currentUser.username,

        avatar: currentUser.avatar,

        time: Date.now()

    });

    toast("✅ Mikrofon isteği gönderildi");

}

/* ===========================
OWNER ACCEPT
=========================== */

function acceptMicRequest(userId, seatNo){

    const request = micRequests.find(x=>x.id===userId);

    if(!request){

        toast("İstek bulunamadı");

        return;

    }

    micSeats[seatNo-1].user=request;

    micRequests.splice(

        micRequests.indexOf(request),

        1

    );

    renderSeats();

    toast("🎤 Kullanıcı mikrofona alındı");

}

/* ===========================
REJECT REQUEST
=========================== */

function rejectMicRequest(userId){

    const request=micRequests.find(

        x=>x.id===userId

    );

    if(!request) return;

    micRequests.splice(

        micRequests.indexOf(request),

        1

    );

    toast("❌ Mikrofon isteği reddedildi");

}

/* ===========================
RENDER SEATS
=========================== */

function renderSeats(){

    document

    .querySelectorAll(".micSeat")

    .forEach((seat,index)=>{

        const mic=micSeats[index];

        const img=seat.querySelector("img");

        const text=seat.querySelector("span");

        if(mic.user){

            img.src=mic.user.avatar;

            text.innerHTML=mic.user.username;

        }else{

            img.src="../assets/avatar/default.png";

            text.innerHTML=index+1;

        }

        if(mic.locked){

            seat.classList.add("locked");

        }else{

            seat.classList.remove("locked");

        }

        if(mic.mute){

            seat.classList.add("muted");

        }else{

            seat.classList.remove("muted");

        }

    });

}

/* ===========================
SPEAKING EFFECT
=========================== */

function speakingStart(seatNo){

    const seat=document

    .querySelectorAll(".micSeat")[seatNo-1];

    if(!seat) return;

    seat.classList.add("speaking");

}

function speakingStop(seatNo){

    const seat=document

    .querySelectorAll(".micSeat")[seatNo-1];

    if(!seat) return;

    seat.classList.remove("speaking");

}

/* ===========================
ROOM LOG
=========================== */

const roomLogs=[];

function addRoomLog(action,user){

    roomLogs.unshift({

        action,

        user,

        time:new Date()

            .toLocaleTimeString()

    });

}

/* ===========================
ADD MODERATOR
=========================== */

function addModerator(userId){

    if(roomModerators.includes(userId))

        return;

    roomModerators.push(userId);

    addRoomLog(

        "Moderator Added",

        userId

    );

    toast("🛡 Moderatör eklendi");

}

/* ===========================
REMOVE MODERATOR
=========================== */

function removeModerator(userId){

    const index=

    roomModerators.indexOf(userId);

    if(index===-1) return;

    roomModerators.splice(index,1);

    addRoomLog(

        "Moderator Removed",

        userId

    );

    toast("🗑 Moderatör kaldırıldı");

}

/* ===========================
ADD COHOST
=========================== */

function addCoHost(userId){

    if(roomCoHosts.includes(userId))

        return;

    roomCoHosts.push(userId);

    addRoomLog(

        "CoHost Added",

        userId

    );

    toast("⭐ Co-Host atandı");

}

/* ===========================
REMOVE COHOST
=========================== */

function removeCoHost(userId){

    const index=

    roomCoHosts.indexOf(userId);

    if(index===-1) return;

    roomCoHosts.splice(index,1);

    addRoomLog(

        "CoHost Removed",

        userId

    );

    toast("⭐ Co-Host kaldırıldı");

}
/* ==========================================
   EY LIVE
   ROOM SECURITY
========================================== */

/* ===========================
BAN SYSTEM
=========================== */

const roomBans=[];

function banUser(userId,reason=""){

    if(roomBans.find(x=>x.id===userId)){

        toast("Kullanıcı zaten yasaklı");

        return;

    }

    roomBans.push({

        id:userId,

        reason:reason,

        date:Date.now(),

        by:currentUser.id

    });

    addRoomLog("Ban",userId);

    toast("🚫 Kullanıcı yasaklandı");

}

/* ===========================
UNBAN
=========================== */

function unbanUser(userId){

    const index=roomBans.findIndex(

        x=>x.id===userId

    );

    if(index==-1) return;

    roomBans.splice(index,1);

    addRoomLog("Unban",userId);

    toast("✅ Yasak kaldırıldı");

}

/* ===========================
KICK USER
=========================== */

function kickUser(userId){

    const index=roomUsers.findIndex(

        x=>x.id===userId

    );

    if(index==-1) return;

    roomUsers.splice(index,1);

    addRoomLog("Kick",userId);

    toast("👢 Kullanıcı odadan çıkarıldı");

}

/* ===========================
MUTE CHAT
=========================== */

const mutedUsers=[];

function muteUser(userId){

    if(mutedUsers.includes(userId))

        return;

    mutedUsers.push(userId);

    addRoomLog("Mute",userId);

    toast("🔇 Sohbet susturuldu");

}

function unmuteUser(userId){

    const index=

    mutedUsers.indexOf(userId);

    if(index==-1) return;

    mutedUsers.splice(index,1);

    addRoomLog("Unmute",userId);

    toast("🔊 Sohbet açıldı");

}

/* ===========================
ROOM ANNOUNCEMENT
=========================== */

let roomNotice="";

function setRoomNotice(text){

    roomNotice=text;

    document.getElementById(

        "roomNotice"

    ).innerHTML=text;

    addRoomLog(

        "Announcement",

        currentUser.id

    );

}

/* ===========================
ROOM SETTINGS
=========================== */

function updateRoom(data){

    ROOM.name=data.name;

    ROOM.locked=data.locked;

    ROOM.maxMic=data.maxMic;

    document.getElementById(

        "roomName"

    ).innerHTML=ROOM.name;

    addRoomLog(

        "Room Updated",

        currentUser.id

    );

    toast("💾 Oda ayarları kaydedildi");

}

/* ===========================
OWNER CHECK
=========================== */

function checkPermission(permission){

    if(isOwner())

        return true;

    if(permission==="moderate"

        && isModerator())

        return true;

    if(permission==="cohost"

        && isCoHost())

        return true;

    toast("⛔ Yetkiniz yok");

    return false;

}

/* ===========================
SAVE ROOM
=========================== */

function saveRoom(){

    localStorage.setItem(

        "eylive_room_"+ROOM.id,

        JSON.stringify({

            room:ROOM,

            seats:micSeats,

            moderators:roomModerators,

            cohosts:roomCoHosts,

            bans:roomBans,

            logs:roomLogs

        })

    );

}

/* ===========================
LOAD ROOM
=========================== */

function loadRoomData(){

    const data=localStorage.getItem(

        "eylive_room_"+ROOM.id

    );

    if(!data) return;

    const room=

    JSON.parse(data);

    Object.assign(ROOM,room.room);

}
/* ==========================================
   EY LIVE
   REALTIME ROOM ENGINE
========================================== */

/* ===========================
ROOM STATE
=========================== */

const roomState={

playingMusic:false,

gameRunning:false,

giftQueue:[],

joinQueue:[],

speakingUsers:[],

};

/* ===========================
USER JOIN
=========================== */

function joinRoom(user){

    if(roomUsers.find(x=>x.id===user.id))

        return;

    roomUsers.push(user);

    ROOM.online=roomUsers.length;

    updateOnline();

    roomState.joinQueue.push(user);

    playJoinAnimation(user);

    addRoomLog("Join",user.id);

}

/* ===========================
USER LEAVE
=========================== */

function leaveRoom(userId){

    const index=roomUsers.findIndex(

        x=>x.id===userId

    );

    if(index==-1)

        return;

    roomUsers.splice(index,1);

    ROOM.online=roomUsers.length;

    updateOnline();

    addRoomLog("Leave",userId);

}

/* ===========================
ONLINE
=========================== */

function updateOnline(){

    const online=document.getElementById(

        "onlineCount"

    );

    if(online)

        online.innerHTML=ROOM.online;

}

/* ===========================
JOIN EFFECT
=========================== */

function playJoinAnimation(user){

    toast(

        "🎉 "+user.username+

        " odaya katıldı"

    );

}

/* ===========================
GIFT SYSTEM
=========================== */

function sendGift(gift){

    roomState.giftQueue.push(gift);

    playGift(gift);

}

function playGift(gift){

    toast(

        "🎁 "+gift.name+

        " gönderildi"

    );

}

/* ===========================
VOICE EFFECT
=========================== */

function voiceLevel(

seat,

level

){

    const seats=document

    .querySelectorAll(".micSeat");

    if(!seats[seat-1])

        return;

    seats[seat-1]

    .style.boxShadow=

`0 0 ${level}px #7B2EFF`;

}

/* ===========================
START TALK
=========================== */

function startTalking(seat){

    speakingStart(seat);

    roomState.speakingUsers.push(seat);

}

/* ===========================
STOP TALK
=========================== */

function stopTalking(seat){

    speakingStop(seat);

    roomState.speakingUsers=

    roomState.speakingUsers

    .filter(x=>x!=seat);

}

/* ===========================
EMOJI
=========================== */

function sendEmoji(icon){

    toast(icon);

}

/* ===========================
CHAT
=========================== */

function sendChat(text){

    if(!text)

        return;

    const box=document

    .getElementById(

        "chatMessages"

    );

    const div=document

    .createElement("div");

    div.className="chatItem";

    div.innerHTML=

    `

    <img src="${currentUser.avatar}">

    <div>

    <b>${currentUser.username}</b>

    <p>${text}</p>

    </div>

    `;

    box.appendChild(div);

    box.scrollTop=

    box.scrollHeight;

}

/* ===========================
MESSAGE
=========================== */

document

.getElementById(

"sendMessage"

)

.onclick=()=>{

const input=document

.getElementById(

"roomMessage"

);

sendChat(

input.value

);

input.value="";

};
/* ==========================================
   EY LIVE
   ROOM ENGINE FINAL
========================================== */

/* ===========================
SYNC ENGINE
=========================== */

let roomSyncTimer = null;

function startRoomSync() {

    if (roomSyncTimer) return;

    roomSyncTimer = setInterval(() => {

        syncRoom();

    }, 2000);

}

function stopRoomSync() {

    clearInterval(roomSyncTimer);

    roomSyncTimer = null;

}

function syncRoom() {

    saveRoom();

}

/* ===========================
ROOM TIMER
=========================== */

let roomSeconds = 0;

setInterval(() => {

    roomSeconds++;

    const h = Math.floor(roomSeconds / 3600);
    const m = Math.floor((roomSeconds % 3600) / 60);

    const t = document.getElementById("roomTime");

    if (t) {

        t.innerHTML =
            String(h).padStart(2, "0") +
            ":" +
            String(m).padStart(2, "0");

    }

}, 1000);

/* ===========================
OWNER TRANSFER
=========================== */

function transferRoom(newOwnerId) {

    if (!isOwner()) {

        toast("Yetkiniz yok");

        return;

    }

    ROOM.owner = newOwnerId;

    addRoomLog("Owner Changed", newOwnerId);

    toast("👑 Oda sahibi değiştirildi");

}

/* ===========================
ROOM CLOSE
=========================== */

function closeRoom() {

    if (!isOwner()) {

        toast("Sadece oda sahibi kapatabilir");

        return;

    }

    stopRoomSync();

    localStorage.removeItem(
        "eylive_room_" + ROOM.id
    );

    window.location.href = "home.html";

}

/* ===========================
MIC LOCK ALL
=========================== */

function lockAllMics() {

    micSeats.forEach(m => {

        m.locked = true;

    });

    renderSeats();

    toast("🔒 Tüm mikrofonlar kilitlendi");

}

function unlockAllMics() {

    micSeats.forEach(m => {

        m.locked = false;

    });

    renderSeats();

    toast("🔓 Mikrofonlar açıldı");

}

/* ===========================
ROOM MUSIC
=========================== */

function playMusic() {

    roomState.playingMusic = true;

    toast("🎵 Oda müziği başladı");

}

function stopMusic() {

    roomState.playingMusic = false;

    toast("⏹ Müzik durduruldu");

}

/* ===========================
AUTO SAVE
=========================== */

window.addEventListener("beforeunload", () => {

    saveRoom();

});

/* ===========================
START
=========================== */

startRoomSync();

renderSeats();

updateOnline();

console.log("EY LIVE ROOM ENGINE READY");
