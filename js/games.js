/* ==========================================
   EY LIVE CASINO ENGINE v2
========================================== */

(function () {

const me0 = UI.requireAuth();

if (!me0) return;

document.getElementById("navHost").innerHTML =
UI.bottomNav("games");

/*==================================
OYUN DURUMU
==================================*/

let currentGame = null;

let currentBet = 20;

let casinoSettings = {};

let player = null;

/*==================================
OYUNLAR
==================================*/

const GAME_LIST = [

{
id:"candy",
icon:"🍭",
title:"EY Candy",
min:10,
color:"#ff4fc3"
},

{
id:"olympus",
icon:"⚡",
title:"EY Olympus",
min:20,
color:"#7b5cff"
},

{
id:"slot",
icon:"🎰",
title:"Lucky Slot",
min:10,
color:"#ffb400"
},

{
id:"wheel",
icon:"🎡",
title:"Lucky Wheel",
min:20,
color:"#42c7ff"
},

{
id:"diamond",
icon:"💎",
title:"Diamond Spin",
min:50,
color:"#00d9ff"
},

{
id:"dice",
icon:"🎲",
title:"Zar At",
min:5,
color:"#44dd77"
}

];

/*==================================
KULLANICI
==================================*/

function loadPlayer(){

player = DB.getUser(me0.id);

return player;

}

/*==================================
BAŞLAT
==================================*/

init();

function init(){

loadPlayer();

loadCasino();

renderHome();

}
   /*==================================
CASINO AYARLARI
==================================*/

function loadCasino(){

    try{

        const settings = DB.getCasinoSettings?.();

        if(settings){

            casinoSettings = settings;

        }

    }catch(e){

        console.log("Casino ayarları yüklenemedi.");

        casinoSettings = {};

    }

}

/*==================================
OYUN AKTİF Mİ?
==================================*/

function isGameEnabled(id){

    if(!casinoSettings[id]) return true;

    return casinoSettings[id].enabled !== false;

}

/*==================================
MINIMUM BAHİS
==================================*/

function getMinBet(id){

    if(!casinoSettings[id]){

        const g = GAME_LIST.find(x=>x.id===id);

        return g ? g.min : 10;

    }

    return casinoSettings[id].minBet || 10;

}

/*==================================
ANA SAYFA
==================================*/

function renderHome(){

    player = loadPlayer();

    let html = `

        ${UI.topBar("🎮 EY Casino")}

        <div class="walletCard">

            <div>

                <small>Coin Bakiyesi</small>

                <h2>💰 ${player.coin.toLocaleString("tr-TR")}</h2>

            </div>

        </div>

        <div class="casinoQuickActions">

            <button class="btn btnGhost" onclick="Games.dailyBonus()">🎁 Günlük Bonus</button>

            <button class="btn btnGhost" onclick="Games.mysteryBox()">📦 Sandık</button>

            <button class="btn btnGhost" onclick="Games.missions()">🎯 Görevler</button>

            <button class="btn btnGhost" onclick="Games.history()">📜 Geçmiş</button>

            <button class="btn btnGhost" onclick="Games.leaderboard()">🏆 Lider Tablosu</button>

            <button class="btn btnGhost" onclick="Games.tournament()">🏅 Turnuva</button>

        </div>

        <div class="sectionTitle">

            Casino Oyunları

        </div>

        <div class="gameGrid">

    `;

    GAME_LIST.forEach(game=>{

        if(!isGameEnabled(game.id)) return;

        html += `

        <div
            class="gameCard"
            onclick="Games.open('${game.id}')">

            <div
                class="gIcon"
                style="background:${game.color}22">

                ${game.icon}

            </div>

            <div class="gName">

                ${game.title}

            </div>

            <div class="gMin">

                Min ${getMinBet(game.id)}

            </div>

        </div>

        `;

    });

    html += `

        </div>

    `;

    document.getElementById("gamesPage").innerHTML = html;

}
   /*==================================
OYUN AÇ
==================================*/

window.Games = {

open(game){

currentGame = game;

switch(game){

case "candy":

renderCandy();

break;

case "olympus":

renderOlympus();

break;

case "slot":

renderSlot();

break;

case "wheel":

renderWheel();

break;

case "diamond":

renderDiamond();

break;

case "dice":

renderDice();

break;

}

},

changeBet(value){

currentBet += value;

if(currentBet < 5){

currentBet = 5;

}

const el = document.getElementById("betValue");

if(el){

el.innerHTML = currentBet.toLocaleString("tr-TR");

}

},

home(){

renderHome();

},

spin(){

playCurrentGame();

},

history(){

renderHistory();

},

leaderboard(){

renderLeaderboard();

},

missions(){

renderMissions();

},

claimMission(id){

claimMission(id);

},

mysteryBox(){

openMysteryBox();

renderHome();

},

dailyBonus(){

claimDailyBonus();

renderHome();

},

tournament(){

joinTournament();

}

};

/*==================================
BAHİS KUTUSU
==================================*/

function betPanel(){

return `

<div class="betPanel">

<button onclick="Games.changeBet(-10)">

−

</button>

<div class="betBox">

💰

<span id="betValue">

${currentBet}

</span>

</div>

<button onclick="Games.changeBet(10)">

+

</button>

</div>

`;

}

/*==================================
SPIN SONUCUNU İŞLE (ORTAK)
==================================*/

function finalizeSpin(gameName,bet,win,multiplier){

    if(win>0){

        checkWinAnimation(multiplier,win);

        checkJackpot(multiplier);

    }

    addHistory(gameName,bet,win);

    rewardXP();

}

/*==================================
SONUÇ KUTUSU
==================================*/

function resultPanel(){

return `

<div

id="gameResult"

class="gameResult">

Hazır...

</div>

`;

}
   /*==================================
EY CANDY
==================================*/

const candySymbols = [

"🍭",
"🍬",
"🍒",
"🍇",
"🍉",
"🍋",
"⭐",
"💎"

];

function randomCandy(){

    return candySymbols[
        Math.floor(
            Math.random()*candySymbols.length
        )
    ];

}

function renderCandy(){

player = loadPlayer();

let grid="";

for(let i=0;i<30;i++){

grid+=`

<div class="candyCell">

${randomCandy()}

</div>

`;

}

document.getElementById("gamesPage").innerHTML=`

${UI.topBar("🍭 EY Candy",{back:true})}

<div class="casinoWallet">

💰 ${player.coin.toLocaleString("tr-TR")}

</div>

<div class="candyBoard"

id="candyBoard">

${grid}

</div>

<div class="multiBox">

Çarpan

<span id="candyMultiplier">

1x

</span>

</div>

<div class="freeSpinBox">

Free Spin

<span id="freeSpinCount">

0

</span>

</div>

${betPanel()}

${resultPanel()}

<button

class="btn btnPrimary btnBlock"

onclick="Games.spin()">

🍭 SPIN

</button>

`;

}
   /*==================================
EY CANDY SPIN
==================================*/

function playCurrentGame(){

    switch(currentGame){

        case "candy":

            playCandy();

            break;

        case "olympus":

            playOlympus();

            break;

        case "slot":

            playSlot();

            break;

        case "wheel":

            playWheel();

            break;

        case "diamond":

            playDiamond();

            break;

        case "dice":

            playDice();

            break;

    }

}

function playCandy(){

    player = loadPlayer();

    if(player.coin < currentBet){

        UI.toast("Yetersiz Coin","error");

        return;

    }

    DB.updateUser(player.id,{
        coin:player.coin-currentBet
    });

    const board=document.getElementById("candyBoard");

    const cells=board.querySelectorAll(".candyCell");

    cells.forEach(cell=>{

        cell.classList.add("spin");

    });

    setTimeout(()=>{

        cells.forEach(cell=>{

            cell.classList.remove("spin");

            cell.innerHTML=randomCandy();

        });

        calculateCandyWin();

    },1800);

}

/*==================================
KAZANÇ
==================================*/

function calculateCandyWin(){

    player=loadPlayer();

    let multiplier=0;

    const chance=Math.random()*100;

    if(chance<45){

        multiplier=0;

    }else if(chance<70){

        multiplier=2;

    }else if(chance<85){

        multiplier=5;

    }else if(chance<94){

        multiplier=10;

    }else if(chance<98){

        multiplier=25;

    }else{

        multiplier=100;

    }

    document.getElementById("candyMultiplier").innerHTML=

    multiplier+"x";

    const total=currentBet*multiplier;

    if(total>0){

        DB.updateUser(player.id,{
            coin:player.coin+total
        });

        DB.addWalletTx(

            player.id,

            "casino_win",

            total,

            "coin",

            "EY Candy"

        );

    }

    showCandyResult(total);

    finalizeSpin("EY Candy",currentBet,total,multiplier);

}
   /*==================================
CASCADE (DÜŞEN SEMBOLLER)
==================================*/

function showCandyResult(winAmount){

    const result=document.getElementById("gameResult");

    if(!result) return;

    if(winAmount>0){

        result.innerHTML=
        `🎉 Kazandın! +${winAmount.toLocaleString("tr-TR")} Coin`;

        result.className="gameResult win";

        startCandyCascade();

    }else{

        result.innerHTML="😢 Kazanamadın";

        result.className="gameResult lose";

    }

}

/*==================================
SEMBOLLERİ YENİLE
==================================*/

function startCandyCascade(){

    const cells=document.querySelectorAll(".candyCell");

    let delay=0;

    cells.forEach(cell=>{

        setTimeout(()=>{

            cell.classList.add("cascade");

        },delay);

        setTimeout(()=>{

            cell.innerHTML=randomCandy();

            cell.classList.remove("cascade");

        },delay+250);

        delay+=35;

    });

}

/*==================================
FREE SPIN
==================================*/

let freeSpin=0;

function addFreeSpin(count){

    freeSpin+=count;

    const el=document.getElementById("freeSpinCount");

    if(el){

        el.innerHTML=freeSpin;

    }

}

/*==================================
FREE SPIN KONTROLÜ
==================================*/

function consumeFreeSpin(){

    if(freeSpin<=0){

        return false;

    }

    freeSpin--;

    const el=document.getElementById("freeSpinCount");

    if(el){

        el.innerHTML=freeSpin;

    }

    return true;

}
   /*==================================
EY OLYMPUS
==================================*/

const olympusSymbols=[

"⚡",
"👑",
"💎",
"🔥",
"⭐",
"🟣",
"🪙",
"🏛️"

];

function randomOlympus(){

    return olympusSymbols[
        Math.floor(
            Math.random()*olympusSymbols.length
        )
    ];

}

function renderOlympus(){

    player=loadPlayer();

    let grid="";

    for(let i=0;i<30;i++){

        grid+=`

        <div class="olympusCell">

            ${randomOlympus()}

        </div>

        `;

    }

    document.getElementById("gamesPage").innerHTML=`

    ${UI.topBar("⚡ EY Olympus",{back:true})}

    <div class="casinoWallet">

        💰 ${player.coin.toLocaleString("tr-TR")}

    </div>

    <div
        class="olympusBoard"
        id="olympusBoard">

        ${grid}

    </div>

    <div class="multiBox">

        Çarpan

        <span id="olympusMultiplier">

            1x

        </span>

    </div>

    ${betPanel()}

    ${resultPanel()}

    <button

        class="btn btnPrimary btnBlock"

        onclick="Games.spin()">

        ⚡ SPIN

    </button>

    `;

}

function playOlympus(){

    player=loadPlayer();

    if(player.coin<currentBet){

        UI.toast("Yetersiz Coin","error");

        return;

    }

    DB.updateUser(player.id,{

        coin:player.coin-currentBet

    });

    const board=document.getElementById("olympusBoard");

    const cells=board.querySelectorAll(".olympusCell");

    cells.forEach(cell=>{

        cell.classList.add("spin");

    });

    setTimeout(()=>{

        cells.forEach(cell=>{

            cell.classList.remove("spin");

            cell.innerHTML=randomOlympus();

        });

        const multiplier=generateMultiplier("olympus");

        const multiEl=document.getElementById("olympusMultiplier");

        if(multiEl){

            multiEl.innerHTML=multiplier+"x";

        }

        const win=currentBet*multiplier;

        if(win>0){

            player=loadPlayer();

            DB.updateUser(player.id,{

                coin:player.coin+win

            });

            DB.addWalletTx(

                player.id,

                "casino_win",

                win,

                "coin",

                "EY Olympus"

            );

        }

        showCandyResult(win);

        finalizeSpin("EY Olympus",currentBet,win,multiplier);

    },1800);

}
   /*==================================
RTP ENGINE
==================================*/

function getGameConfig(game){

    if(!casinoSettings[game]){

        return{

            rtp:90,
            maxMultiplier:100,
            enabled:true

        };

    }

    return casinoSettings[game];

}

/*==================================
ÇARPAN ÜRET
==================================*/

function generateMultiplier(game){

    const config=getGameConfig(game);

    const rtp=Number(config.rtp||90);

    const max=Number(config.maxMultiplier||100);

    const roll=Math.random()*100;

    if(roll>rtp){

        return 0;

    }

    const values=[

        2,
        5,
        10,
        25,
        50,
        100,
        250,
        500,
        1000

    ].filter(v=>v<=max);

    if(values.length===0){

        return 2;

    }

    return values[
        Math.floor(
            Math.random()*values.length
        )
    ];

}
   /*==================================
DIAMOND SPIN
==================================*/

const diamondSymbols=[

"💎",
"🔷",
"🔹",
"💍",
"👑",
"⭐"

];

function randomDiamond(){

    return diamondSymbols[
        Math.floor(Math.random()*diamondSymbols.length)
    ];

}

function renderDiamond(){

    player=loadPlayer();

    let html="";

    for(let i=0;i<25;i++){

        html+=`

        <div class="diamondCell">

            ${randomDiamond()}

        </div>

        `;

    }

    document.getElementById("gamesPage").innerHTML=`

    ${UI.topBar("💎 Diamond Spin",{back:true})}

    <div class="casinoWallet">

        💰 ${player.coin.toLocaleString("tr-TR")}

    </div>

    <div id="diamondBoard"

    class="diamondBoard">

        ${html}

    </div>

    ${betPanel()}

    ${resultPanel()}

    <button

    class="btn btnPrimary btnBlock"

    onclick="Games.spin()">

        💎 SPIN

    </button>

    `;

}

function playDiamond(){

    player=loadPlayer();

    if(player.coin<currentBet){

        UI.toast("Yetersiz Coin","error");

        return;

    }

    DB.updateUser(player.id,{

        coin:player.coin-currentBet

    });

    const board=

    document.querySelectorAll(".diamondCell");

    board.forEach(c=>{

        c.classList.add("spin");

    });

    setTimeout(()=>{

        board.forEach(c=>{

            c.classList.remove("spin");

            c.innerHTML=randomDiamond();

        });

        const multiplier=

        generateMultiplier("diamond");

        const win=currentBet*multiplier;

        if(win>0){

            player=loadPlayer();

            DB.updateUser(player.id,{

                coin:player.coin+win

            });

            DB.addWalletTx(

                player.id,

                "casino_win",

                win,

                "coin",

                "Diamond Spin"

            );

        }

        showCandyResult(win);

        finalizeSpin("Diamond Spin",currentBet,win,multiplier);

    },1800);

}

/*==================================
LUCKY SLOT
==================================*/

const slotSymbols=[

"🍒",
"🍋",
"🍇",
"🔔",
"⭐",
"💰",
"7️⃣"

];

const slotPayouts={

"7️⃣":50,
"💰":30,
"⭐":20,
"🔔":15,
"🍇":10,
"🍋":8,
"🍒":5

};

function randomSlot(){

    return slotSymbols[
        Math.floor(Math.random()*slotSymbols.length)
    ];

}

function renderSlot(){

    player=loadPlayer();

    let reels="";

    for(let i=0;i<3;i++){

        reels+=`

        <div class="slotReel" id="slotReel${i}">

            ${randomSlot()}

        </div>

        `;

    }

    document.getElementById("gamesPage").innerHTML=`

    ${UI.topBar("🎰 Lucky Slot",{back:true})}

    <div class="casinoWallet">

        💰 ${player.coin.toLocaleString("tr-TR")}

    </div>

    <div id="slotBoard" class="slotBoard">

        ${reels}

    </div>

    <div class="multiBox">

        Çarpan

        <span id="slotMultiplier">

            1x

        </span>

    </div>

    ${betPanel()}

    ${resultPanel()}

    <button

        class="btn btnPrimary btnBlock"

        onclick="Games.spin()">

        🎰 ÇEVİR

    </button>

    `;

}

function playSlot(){

    player=loadPlayer();

    if(player.coin<currentBet){

        UI.toast("Yetersiz Coin","error");

        return;

    }

    DB.updateUser(player.id,{

        coin:player.coin-currentBet

    });

    const reels=document.querySelectorAll(".slotReel");

    reels.forEach(r=>{

        r.classList.add("spin");

    });

    setTimeout(()=>{

        const results=[];

        reels.forEach(r=>{

            r.classList.remove("spin");

            const symbol=randomSlot();

            r.innerHTML=symbol;

            results.push(symbol);

        });

        let multiplier=0;

        if(results[0]===results[1] && results[1]===results[2]){

            multiplier=slotPayouts[results[0]]||10;

        }else if(

            results[0]===results[1] ||
            results[1]===results[2] ||
            results[0]===results[2]

        ){

            multiplier=2;

        }

        const multiEl=document.getElementById("slotMultiplier");

        if(multiEl){

            multiEl.innerHTML=multiplier+"x";

        }

        const win=currentBet*multiplier;

        if(win>0){

            player=loadPlayer();

            DB.updateUser(player.id,{

                coin:player.coin+win

            });

            DB.addWalletTx(

                player.id,

                "casino_win",

                win,

                "coin",

                "Lucky Slot"

            );

        }

        showCandyResult(win);

        finalizeSpin("Lucky Slot",currentBet,win,multiplier);

    },1800);

}

/*==================================
LUCKY WHEEL
==================================*/

function renderWheel(){

    player=loadPlayer();

    document.getElementById("gamesPage").innerHTML=`

    ${UI.topBar("🎡 Lucky Wheel",{back:true})}

    <div class="casinoWallet">

        💰 ${player.coin.toLocaleString("tr-TR")}

    </div>

    <div id="wheel"

    class="wheelBox">

        🎡

    </div>

    ${betPanel()}

    ${resultPanel()}

    <button

    class="btn btnPrimary btnBlock"

    onclick="Games.spin()">

        🎡 ÇEVİR

    </button>

    `;

}

function playWheel(){

    player=loadPlayer();

    if(player.coin<currentBet){

        UI.toast("Yetersiz Coin","error");

        return;

    }

    DB.updateUser(player.id,{

        coin:player.coin-currentBet

    });

    const wheel=document.getElementById("wheel");

    const deg=1440+

    Math.floor(Math.random()*360);

    wheel.style.transform=

    `rotate(${deg}deg)`;

    setTimeout(()=>{

        const multiplier=

        generateMultiplier("wheel");

        const win=currentBet*multiplier;

        if(win>0){

            player=loadPlayer();

            DB.updateUser(player.id,{

                coin:player.coin+win

            });

            DB.addWalletTx(

                player.id,

                "casino_win",

                win,

                "coin",

                "Lucky Wheel"

            );

        }

        showCandyResult(win);

        finalizeSpin("Lucky Wheel",currentBet,win,multiplier);

    },2500);

}
   /*==================================
DICE GAME
==================================*/

function renderDice(){

    player = loadPlayer();

    document.getElementById("gamesPage").innerHTML = `

    ${UI.topBar("🎲 Zar Oyunu",{back:true})}

    <div class="casinoWallet">

        💰 ${player.coin.toLocaleString("tr-TR")}

    </div>

    <div class="diceBoard">

        <div id="diceFace" class="diceFace">

            ⚀

        </div>

    </div>

    ${betPanel()}

    ${resultPanel()}

    <button
        class="btn btnPrimary btnBlock"
        onclick="Games.spin()">

        🎲 ZAR AT

    </button>

    `;

}

function playDice(){

    player = loadPlayer();

    if(player.coin < currentBet){

        UI.toast("Yetersiz Coin","error");

        return;

    }

    DB.updateUser(player.id,{

        coin:player.coin-currentBet

    });

    const dice=document.getElementById("diceFace");

    dice.classList.add("spin");

    setTimeout(()=>{

        dice.classList.remove("spin");

        const number=
        Math.floor(Math.random()*6)+1;

        const face=[
            "",
            "⚀",
            "⚁",
            "⚂",
            "⚃",
            "⚄",
            "⚅"
        ];

        dice.innerHTML=face[number];

        const multiplier=
        generateMultiplier("dice");

        const win=
        currentBet*multiplier;

        if(win>0){

            player=loadPlayer();

            DB.updateUser(player.id,{

                coin:player.coin+win

            });

            DB.addWalletTx(

                player.id,

                "casino_win",

                win,

                "coin",

                "Dice"

            );

        }

        showCandyResult(win);

        finalizeSpin("Zar At",currentBet,win,multiplier);

    },1200);

}

/*==================================
JACKPOT
==================================*/

function checkJackpot(multiplier){

    if(multiplier>=500){

        UI.toast(
            "💥 JACKPOT!",
            "success"
        );

        return;

    }

    if(multiplier>=100){

        UI.toast(
            "🏆 BIG WIN!",
            "success"
        );

        return;

    }

    if(multiplier>=25){

        UI.toast(
            "🎉 MEGA WIN!",
            "success"
        );

    }

}

/*==================================
GÜNLÜK FREE SPIN
==================================*/

function giveDailyFreeSpin(){

    const today=
    new Date().toDateString();

    const last=
    localStorage.getItem("dailySpin");

    if(last===today){

        return;

    }

    localStorage.setItem(

        "dailySpin",

        today

    );

    addFreeSpin(10);

    UI.toast(

        "🎁 Günlük 10 Free Spin",

        "success"

    );

}

giveDailyFreeSpin();
   /*==================================
COIN ANIMATION
==================================*/

function coinRain(amount){

    const total=Math.min(
        Math.max(
            Math.floor(amount/50),
            10
        ),
        60
    );

    for(let i=0;i<total;i++){

        const coin=document.createElement("div");

        coin.className="coinFly";

        coin.innerHTML="🪙";

        coin.style.left=
        Math.random()*100+"vw";

        coin.style.animationDelay=
        (Math.random()*0.8)+"s";

        document.body.appendChild(coin);

        setTimeout(()=>{

            coin.remove();

        },2500);

    }

}

/*==================================
BIG WIN EFFECT
==================================*/

function bigWin(title,amount){

    const layer=document.createElement("div");

    layer.className="bigWinLayer";

    layer.innerHTML=`

        <div class="bigWinBox">

            <h1>${title}</h1>

            <h2>

                💰

                ${amount.toLocaleString("tr-TR")}

            </h2>

        </div>

    `;

    document.body.appendChild(layer);

    coinRain(amount);

    setTimeout(()=>{

        layer.remove();

    },3000);

}

/*==================================
WIN EFFECT
==================================*/

function checkWinAnimation(multiplier,win){

    if(multiplier>=500){

        bigWin("💥 JACKPOT",win);

        return;

    }

    if(multiplier>=100){

        bigWin("🏆 BIG WIN",win);

        return;

    }

    if(multiplier>=25){

        bigWin("🎉 MEGA WIN",win);

    }

}

/*==================================
SES
==================================*/

let sound=true;

function toggleSound(){

    sound=!sound;

    localStorage.setItem(

        "casinoSound",

        sound

    );

}

(function(){

    const s=

    localStorage.getItem("casinoSound");

    if(s!==null){

        sound=s==="true";

    }

})();

/*==================================
KAZANÇ GEÇMİŞİ
==================================*/

function addHistory(game,bet,win){

    const history=

    JSON.parse(

        localStorage.getItem("casinoHistory")

        ||"[]"

    );

    history.unshift({

        game,

        bet,

        win,

        date:Date.now()

    });

    history.splice(30);

    localStorage.setItem(

        "casinoHistory",

        JSON.stringify(history)

    );

}
   /*==================================
CASINO HISTORY
==================================*/

function renderHistory(){

    const history=JSON.parse(

        localStorage.getItem("casinoHistory")||"[]"

    );

    let html="";

    if(history.length===0){

        html="<p class='muted'>Henüz oyun oynanmadı.</p>";

    }

    history.forEach(item=>{

        html+=`

        <div class="historyItem">

            <div>

                <b>${item.game}</b>

                <br>

                <small>

                ${new Date(item.date)

                .toLocaleString("tr-TR")}

                </small>

            </div>

            <div>

                Bet

                💰${item.bet}

            </div>

            <div class="${
                item.win>0
                ?"profit"
                :"loss"
            }">

                ${
                    item.win>0
                    ?"+"
                    :"-"
                }

                ${item.win}

            </div>

        </div>

        `;

    });

    document.getElementById("gamesPage").innerHTML=`

        ${UI.topBar("📜 Oyun Geçmişi",{back:true})}

        <div class="historyList">

            ${html}

        </div>

    `;

}

/*==================================
LEADERBOARD
==================================*/

function renderLeaderboard(){

    const players=DB.getUsers()

    .sort((a,b)=>

        (b.coin||0)-(a.coin||0)

    )

    .slice(0,20);

    let html="";

    players.forEach((user,index)=>{

        html+=`

        <div class="leaderItem">

            <div>

                ${index+1}.

                ${user.nickname}

            </div>

            <div>

                💰

                ${Number(user.coin)

                .toLocaleString("tr-TR")}

            </div>

        </div>

        `;

    });

    document.getElementById("gamesPage").innerHTML=`

    ${UI.topBar("🏆 Casino Liderleri",{back:true})}

    <div class="leaderList">

        ${html}

    </div>

    `;

}
   /*==================================
CASINO MISSIONS
==================================*/

const MISSIONS=[

{

id:"spin10",

title:"10 Spin Yap",

need:10,

reward:500,

type:"coin"

},

{

id:"win5000",

title:"5000 Coin Kazan",

need:5000,

reward:50,

type:"diamond"

},

{

id:"daily",

title:"Günlük Giriş",

need:1,

reward:100,

type:"coin"

}

];

/*==================================
GÖREVLER
==================================*/

function renderMissions(){

let html="";

MISSIONS.forEach(m=>{

html+=`

<div class="missionCard">

<h3>${m.title}</h3>

<p>

Ödül :

${m.reward}

${m.type==="coin"?"💰":"💎"}

</p>

<button

class="btn btnPrimary"

onclick="Games.claimMission('${m.id}')">

Al

</button>

</div>

`;

});

document.getElementById("gamesPage").innerHTML=`

${UI.topBar("🎯 Casino Görevleri",{back:true})}

<div class="missionList">

${html}

</div>

`;

}

/*==================================
GÖREV ÖDÜLÜ
==================================*/

function claimMission(id){

player=loadPlayer();

const mission=

MISSIONS.find(x=>x.id===id);

if(!mission) return;

if(mission.type==="coin"){

DB.updateUser(player.id,{

coin:player.coin+mission.reward

});

}

else{

DB.updateUser(player.id,{

diamond:

(player.diamond||0)+mission.reward

});

}

UI.toast(

"Görev ödülü alındı.",

"success"

);

}

/*==================================
GİZEMLİ SANDIK
==================================*/

function openMysteryBox(){

player=loadPlayer();

const rewards=[

100,

250,

500,

1000,

5000

];

const reward=

rewards[

Math.floor(

Math.random()*rewards.length

)

];

DB.updateUser(player.id,{

coin:player.coin+reward

});

UI.toast(

"📦 "+reward+" Coin kazandın!",

"success"

);

}

/*==================================
GÜNLÜK BONUS
==================================*/

function claimDailyBonus(){

player=loadPlayer();

const today=

new Date().toDateString();

const last=

localStorage.getItem(

"dailyBonus"

);

if(today===last){

UI.toast(

"Bugün zaten aldın.",

"error"

);

return;

}

localStorage.setItem(

"dailyBonus",

today

);

DB.updateUser(player.id,{

coin:player.coin+250

});

UI.toast(

"🎁 +250 Coin",

"success"

);

}
   /*==================================
CASINO LEVEL SYSTEM
==================================*/

function getCasinoXP(){

    player = loadPlayer();

    return player.casinoXP || 0;

}

function getCasinoLevel(){

    return Math.floor(getCasinoXP()/1000)+1;

}

function addCasinoXP(xp){

    player = loadPlayer();

    const total = (player.casinoXP||0)+xp;

    DB.updateUser(player.id,{

        casinoXP:total

    });

}

/*==================================
TURNUVA
==================================*/

function joinTournament(){

    player = loadPlayer();

    if(player.coin<1000){

        UI.toast(

            "Turnuva için 1000 Coin gerekir",

            "error"

        );

        return;

    }

    DB.updateUser(player.id,{

        coin:player.coin-1000

    });

    UI.toast(

        "🏆 Turnuvaya katıldın.",

        "success"

    );

}

/*==================================
SPIN SONRASI XP
==================================*/

function rewardXP(){

    addCasinoXP(10);

}

})();

