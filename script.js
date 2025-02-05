function openTab(tabName) {
    let tabs = document.getElementsByClassName("tab-content");
    for (let tab of tabs) {
        tab.style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

function openSubTab(subTabName) {
    let subTabs = document.getElementsByClassName("sub-tab-content");
    for (let subTab of subTabs) {
        subTab.style.display = "none";
    }
    document.getElementById(subTabName).style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
    openTab('matter');
    openSubTab('matterUpgrades');
});

let player = {
    matter: new Decimal(0),
    tickspeed: 1000,
    matterUpgrade: [upgrade1 = {cost: 10, amount: 0, effect: 0, power: 1}],
    annihilate: {
        amount: 0,
        cost: [100, 1500, 2500],
        effect: 1,
        upgrades: ["Unlock New Matter Upgrade", "Unlock Another Matter Upgrade"],
        value: [1, 2, 3]
    }
}

function matterUpgradeBuy(id) {
    if (player.matter.gte(player.matterUpgrade[id - 1].cost)) {
        player.matter = player.matter.minus(player.matterUpgrade[id - 1].cost);
        if (id = 1) {
            player.matterUpgrade[id - 1].effect = new Decimal(player.matterUpgrade[id - 1].effect).plus(player.matterUpgrade[id - 1].power)
            player.matterUpgrade[id - 1].cost = new Decimal(player.matterUpgrade[id - 1].cost).mul(1.5);
        } else if (id = 2) {

        } else {
            
        }
        document.getElementById("matterCurrency").innerHTML = player.matter.toPrecision(3);
        document.getElementById("matterUpgrade1Cost").innerHTML = player.matterUpgrade[id - 1].cost.toPrecision(3);
        document.getElementById("matterUpgrade1Effect").innerHTML = player.matterUpgrade[id - 1].effect.toPrecision(3);
    }
}

function annUp() {
    if (player.matter.gte(player.annihilate.cost[player.annihilate.amount])) {
        player.matter = new Decimal(0);
        player.matterUpgrade = [upgrade1 = {cost: 10, amount: 0, effect: 0, power: 1}],
        player.annihilate.amount = new Decimal(player.annihilate.amount).plus(1);
        player.annihilate.effect = new Decimal(player.annihilate.effect).plus(0.5); 
        document.getElementById("matterCurrency").innerHTML = player.matter.toPrecision(3);
        document.getElementById("annText").innerHTML = player.annihilate.upgrades[player.annihilate.amount];
        document.getElementById("annCost").innerHTML = player.annihilate.cost[player.annihilate.amount];
        document.getElementById("annValue").innerHTML = player.annihilate.value[player.annihilate.amount];
        document.getElementById("matterUpgrade1Cost").innerHTML = player.matterUpgrade[0].cost.toPrecision(3);
        document.getElementById("matterUpgrade1Effect").innerHTML = player.matterUpgrade[0].effect.toPrecision(3);
    }
}

function gameLoop(currentTime) {
    if (!lastTime) {
        lastTime = currentTime;
    }
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    let deltaTimeSeconds = deltaTime / 1000;
    let e = new Decimal(1);
    e = e.plus(player.matterUpgrade[0].effect);
    e = e.mul(player.annihilate.effect);
    let matterGain = e.mul(deltaTimeSeconds);
    player.matter = player.matter.plus(matterGain);
    document.getElementById("matterCurrency").innerHTML = player.matter.toPrecision(3);
    requestAnimationFrame(gameLoop);
}

let lastTime;
requestAnimationFrame(gameLoop);

//function matterGainLoop() {
//    let e = new Decimal(0);
//    e = e.plus(1);
 //   e = e.plus(player.matterUpgrade[0].effect)
 //   e = e.mul(player.annihilate.effect)
  //  player.matter = (player.matter).plus(e)
  //  document.getElementById("matterCurrency").innerHTML = player.matter.toPrecision(3);
//}
 
//setInterval(() => {
 //   matterGainLoop();
//}, player.tickspeed);
