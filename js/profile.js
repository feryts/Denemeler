import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

/* ==========================
ELEMENTLER
========================== */

const avatar=document.getElementById("avatar");

const cover=document.getElementById("coverImage");

const nickname=document.getElementById("nickname");

const userID=document.getElementById("userID");

const friendCount=document.getElementById("friendCount");

const followCount=document.getElementById("followCount");

const fansCount=document.getElementById("fansCount");

const coinText=document.getElementById("coinText");

const diamondText=document.getElementById("diamondText");

const logoutBtn=document.getElementById("logoutBtn");

const copyBtn=document.getElementById("copyID");

/* ==========================
OTURUM
========================== */

let currentUser=null;

let profileData=null;

/* ==========================
AUTH
========================== */

onAuthStateChanged(auth,async(user)=>{

    if(!user){

        location.href="../login.html";

        return;

    }

    currentUser=user;

    await loadProfile();

});
/* ==========================
PROFİLİ YÜKLE
========================== */

async function loadProfile(){

    try{

        const ref = doc(db,"users",currentUser.uid);

        const snap = await getDoc(ref);

        if(!snap.exists()){

            console.error("Kullanıcı bulunamadı.");

            return;

        }

        profileData = snap.data();

        // Avatar

        avatar.src = profileData.avatar || "../assets/avatars/default.webp";

        // Kapak

        cover.src = profileData.cover || "../assets/covers/default.webp";

        // Kullanıcı Adı

        nickname.innerHTML = `
            ${profileData.nickname}
            <span class="verify">✔</span>
        `;

        // EY ID

        userID.textContent = profileData.userId;

        // Sayaçlar

        friendCount.textContent = profileData.friends || 0;

        followCount.textContent = profileData.following || 0;

        fansCount.textContent = profileData.followers || 0;

        /* ==========================
           GİZLİ CÜZDAN SİSTEMİ
        ========================== */

        const params = new URLSearchParams(location.search);

        const profileUID = params.get("uid");

        const ownProfile =
            !profileUID || profileUID === currentUser.uid;

        if(ownProfile){

            coinText.textContent =
                Number(profileData.coins || 0).toLocaleString("tr-TR");

            diamondText.textContent =
                Number(profileData.diamonds || 0).toLocaleString("tr-TR");

        }else{

            document.querySelector(".coin-card").style.display="none";

            document.querySelector(".diamond-card").style.display="none";

        }

        // Online

        await updateDoc(ref,{

            online:true,

            lastSeen:serverTimestamp()

        });

    }

    catch(err){

        console.error(err);

    }

                }
/* ==========================
ID KOPYALA
========================== */

copyBtn?.addEventListener("click", async () => {

    if (!profileData) return;

    try {

        await navigator.clipboard.writeText(String(profileData.userId));

        showToast("EY ID panoya kopyalandı.");

    } catch (err) {

        console.error(err);

    }

});

/* ==========================
ÇIKIŞ
========================== */

logoutBtn?.addEventListener("click", async () => {

    const ok = confirm("Çıkış yapmak istiyor musun?");

    if (!ok) return;

    try {

        await updateDoc(doc(db, "users", currentUser.uid), {

            online: false,

            lastSeen: serverTimestamp()

        });

        await signOut(auth);

        location.href = "../login.html";

    } catch (err) {

        console.error(err);

        showToast("Çıkış yapılamadı.");

    }

});

/* ==========================
TAKİP ET
========================== */

const followBtn = document.getElementById("followBtn");

followBtn?.addEventListener("click", async () => {

    if (!profileData) return;

    showToast("Takip sistemi sonraki bölümde eklenecek.");

});

/* ==========================
MESAJ
========================== */

const messageBtn = document.getElementById("messageBtn");

messageBtn?.addEventListener("click", () => {

    if (!profileData) return;

    location.href =
        `messages.html?uid=${currentUser.uid}`;

});

/* ==========================
SESLİ ARA
========================== */

const callBtn = document.getElementById("callBtn");

callBtn?.addEventListener("click", () => {

    showToast("Sesli arama yakında aktif olacak.");

});/* ==========================
TOAST
========================== */

function showToast(text){

    let toast=document.getElementById("toast");

    if(!toast){

        toast=document.createElement("div");

        toast.id="toast";

        toast.className="toast";

        document.body.appendChild(toast);

    }

    toast.innerText=text;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}
/* ==========================
TAKİP SİSTEMİ
========================== */

import {
    setDoc,
    deleteDoc,
    increment
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

async function toggleFollow(targetUid){

    if(targetUid===currentUser.uid){

        return;

    }

    try{

        const followRef=doc(
            db,
            "users",
            currentUser.uid,
            "following",
            targetUid
        );

        const followerRef=doc(
            db,
            "users",
            targetUid,
            "followers",
            currentUser.uid
        );

        const exists=await getDoc(followRef);

        if(exists.exists()){

            await deleteDoc(followRef);

            await deleteDoc(followerRef);

            await updateDoc(
                doc(db,"users",currentUser.uid),
                {
                    following:increment(-1)
                }
            );

            await updateDoc(
                doc(db,"users",targetUid),
                {
                    followers:increment(-1)
                }
            );

            followBtn.innerHTML="❤️ Takip Et";

            showToast("Takipten çıkıldı.");

        }else{

            await setDoc(followRef,{
                createdAt:serverTimestamp()
            });

            await setDoc(followerRef,{
                createdAt:serverTimestamp()
            });

            await updateDoc(
                doc(db,"users",currentUser.uid),
                {
                    following:increment(1)
                }
            );

            await updateDoc(
                doc(db,"users",targetUid),
                {
                    followers:increment(1)
                }
            );

            followBtn.innerHTML="✓ Takip Ediliyor";

            showToast("Takip edildi.");

        }

    }catch(err){

        console.error(err);

    }

}
/* ==========================
PROFİL GÖRÜNTÜLEME
========================== */

async function registerProfileVisit(profileUid){

    if(profileUid===currentUser.uid){

        return;

    }

    try{

        await setDoc(

            doc(
                db,
                "users",
                profileUid,
                "visitors",
                currentUser.uid
            ),

            {

                uid:currentUser.uid,

                nickname:profileData.nickname,

                avatar:profileData.avatar,

                createdAt:serverTimestamp()

            }

        );

    }catch(e){

        console.error(e);

    }

}
/* ==========================
PROFİL DÜZENLE
========================== */

const editBtn=document.getElementById("editProfile");

editBtn?.addEventListener("click",()=>{

    location.href="edit-profile.html";

});

/* ==========================
ROL KONTROLÜ
========================== */

function applyRole(){

    if(!profileData) return;

    const role=profileData.role || "user";

    document.querySelectorAll("[data-role]")
    .forEach(el=>{

        const need=el.dataset.role;

        if(role!==need){

            el.remove();

        }

    });

}

/* ==========================
KENDİ PROFİLİ
========================== */

function checkOwnProfile(){

    const params=new URLSearchParams(location.search);

    const uid=params.get("uid");

    if(!uid || uid===currentUser.uid){

        document.body.classList.add("my-profile");

        return true;

    }

    document.body.classList.add("guest-profile");

    return false;

}

/* ==========================
KENDİ PROFİLİNİ GÖRÜNCE
========================== */

const ownProfile=checkOwnProfile();

if(!ownProfile){

    document.querySelectorAll(".only-owner")

    .forEach(el=>{

        el.style.display="none";

    });

}

/* ==========================
ADMIN PANELİ
========================== */

if(profileData?.role==="admin"){

    document.body.classList.add("admin-mode");

}

/* ==========================
HOST PANELİ
========================== */

if(profileData?.role==="host"){

    document.body.classList.add("host-mode");

}

/* ==========================
AJANS
========================== */

if(profileData?.agencyId){

    document.body.classList.add("agency-user");

}

/* ==========================
BAŞLAT
========================== */

document.addEventListener("DOMContentLoaded",()=>{

    applyRole();

});
