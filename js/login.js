/* ==========================================
   EY LIVE LOGIN
========================================== */

(function(){

const agree =
document.getElementById("agree");

window.loginGoogle=function(){

if(!agree.checked){

UI.toast(

"Kullanım şartlarını kabul edin",

"error"

);

return;

}

fakeGoogleLogin();

};

window.openPhoneLogin=function(){

if(!agree.checked){

UI.toast(

"Kullanım şartlarını kabul edin",

"error"

);

return;

}

showPhoneDialog();

};

})();
/*==================================
TELEFON GİRİŞİ
==================================*/

function showPhoneDialog(){

const html=`

<div class="loginPopup">

<div class="loginCard">

<h2>Telefon ile Giriş</h2>

<input

id="loginPhone"

type="tel"

placeholder="05XXXXXXXXX"

maxlength="11">

<button

class="loginAction"

onclick="phoneLogin()">

Devam Et

</button>

<button

class="loginGhost"

onclick="closeLoginPopup()">

İptal

</button>

<hr>

<div class="adminTitle">

Yönetici Girişi

</div>

<button

class="adminBtn"

onclick="showAdminLogin()">

Admin Girişi

</button>

</div>

</div>

`;

document.body.insertAdjacentHTML(

"beforeend",

html

);

}

window.closeLoginPopup=function(){

const popup=document.querySelector(".loginPopup");

if(popup){

popup.remove();

}

};
/*==================================
TELEFON GİRİŞİ
==================================*/

window.phoneLogin=function(){

const phone=document
.getElementById("loginPhone")
.value.trim();

if(phone.length<10){

UI.toast(

"Geçerli telefon giriniz",

"error"

);

return;

}

let user=DB.getUserByPhone(phone);

if(!user){

user=DB.createUser({

phone:phone,

nickname:"Kullanıcı"+

Math.floor(Math.random()*9999),

coin:1000,

diamond:0,

vip:0,

level:1,

avatar:"assets/default-avatar.png"

});

}

DB.login(user.id);

UI.toast(

"Giriş başarılı",

"success"

);

setTimeout(()=>{

location.href="pages/home.html";

},500);

};
/*==================================
TELEFON GİRİŞİ
==================================*/

window.phoneLogin=function(){

const phone=document
.getElementById("loginPhone")
.value.trim();

if(phone.length<10){

UI.toast(
"Telefon numarası giriniz",
"error"
);

return;

}

let user=

DB.getUserByPhoneOrUsername(phone);

if(!user){

user=DB.createUser({

phone:phone,

username:"EY"+

Math.floor(
1000+
Math.random()*9000
),

password:"",

avatar:"🙂",

coin:100,

diamond:0

});

}

DB.setSession(user.id);

UI.toast(

"Hoşgeldin "+user.username,

"success"

);

setTimeout(()=>{

location.href="pages/home.html";

},600);

};
/*==================================
ADMIN
==================================*/

window.showAdminLogin=function(){

const html=`

<div class="loginPopup">

<div class="loginCard">

<h2>

Admin Girişi

</h2>

<input

id="adminUser"

placeholder="Kullanıcı Adı">

<input

id="adminPass"

type="password"

placeholder="Şifre">

<button

class="loginAction"

onclick="adminLogin()">

Giriş Yap

</button>

<button

class="loginGhost"

onclick="closeLoginPopup()">

İptal

</button>

</div>

</div>

`;

closeLoginPopup();

document.body.insertAdjacentHTML(

"beforeend",

html

);

};
/*==================================
ADMIN LOGIN
==================================*/

window.adminLogin=function(){

const username=document
.getElementById("adminUser")
.value.trim();

const password=document
.getElementById("adminPass")
.value.trim();

if(

username!=="admin" ||

password!=="1234"

){

UI.toast(

"Kullanıcı adı veya şifre hatalı",

"error"

);

return;

}

const admin=

DB.getUserByPhoneOrUsername("admin");

if(admin){

DB.setSession(admin.id);

}

UI.toast(

"Admin Paneline Hoşgeldiniz",

"success"

);

setTimeout(()=>{

location.href="pages/admin.html";

},500);

};
