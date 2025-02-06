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
    matterUpgrade:[
        {cost: 10, amount: 0, effect: 0, power: 1, unlocked: 1},
        {cost: 100, amount: 0, effect: 1, power: 1, unlocked: 0}
    ],
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
            player.matterUpgrade[0].effect = new Decimal(player.matterUpgrade[0].effect).plus(player.matterUpgrade[0].power)
            player.matterUpgrade[0].cost = new Decimal(player.matterUpgrade[0].cost).mul(1.5);
        } else if (id = 2) {
            player.matterUpgrade[1].effect = new Decimal(player.matterUpgrade[1].effect).plus(player.matterUpgrade[1].power)
            player.matterUpgrade[1].cost = new Decimal(player.matterUpgrade[1].cost).mul(4);
            player.matterUpgrade[0].power = new Decimal(player.matterUpgrade[0].power).plus(1);
        } else {
            
        }
        document.getElementById("matterCurrency").innerHTML = player.matter.toPrecision(3);
        document.getElementById("matterUpgrade1Cost").innerHTML = player.matterUpgrade[0].cost.toPrecision(3);
        document.getElementById("matterUpgrade1Effect").innerHTML = player.matterUpgrade[0].effect.toPrecision(3);
        document.getElementById("matterUpgrade1Power").innerHTML = player.matterUpgrade[0].power.toPrecision(3);
        document.getElementById("matterUpgrade2Cost").innerHTML = player.matterUpgrade[1].cost.toPrecision(3);
        document.getElementById("matterUpgrade2Effect").innerHTML = player.matterUpgrade[1].effect.toPrecision(3);
    }
}

function annUp() {
    if (player.matter.gte(player.annihilate.cost[player.annihilate.amount])) {
        player.matter = new Decimal(0);
        player.matterUpgrade = [
            {cost: 10, amount: 0, effect: 0, power: 1},
            {cost: 100, amount: 0, effect: 1, power: 1, unlocked: 0}
        ],
        player.annihilate.amount = new Decimal(player.annihilate.amount).plus(1);
        player.annihilate.effect = new Decimal(player.annihilate.effect).plus(0.5); 
        document.getElementById("matterCurrency").innerHTML = player.matter.toPrecision(3);
        document.getElementById("annText").innerHTML = player.annihilate.upgrades[player.annihilate.amount];
        document.getElementById("annCost").innerHTML = player.annihilate.cost[player.annihilate.amount];
        document.getElementById("annValue").innerHTML = player.annihilate.value[player.annihilate.amount];
        
        document.getElementById("matterUpgrade1Cost").innerHTML = player.matterUpgrade[0].cost.toPrecision(3);
        document.getElementById("matterUpgrade1Effect").innerHTML = player.matterUpgrade[0].effect.toPrecision(3);
        document.getElementById("matterUpgrade1Power").innerHTML = player.matterUpgrade[0].power.toPrecision(3);

        document.getElementById("matterUpgrade2Cost").innerHTML = player.matterUpgrade[1].cost.toPrecision(3);
        document.getElementById("matterUpgrade2Effect").innerHTML = player.matterUpgrade[1].effect.toPrecision(3);


        if (player.annihilate.amount > 0) {
            document.querySelector('.mu2').classList.add('visible');
            player.matterUpgrade[1].unlocked = 1;
        }
    }
}

function gameLoop(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Optimized Decimal operations
    const e = new Decimal(1)
        .plus(player.matterUpgrade[0].effect)
        .mul(player.annihilate.effect);
    
    player.matter = player.matter.plus(e.mul(deltaTime/1000));
    
    // Optimized DOM updates
    const el = document.getElementById("matterCurrency");
    const displayValue = player.matter.toPrecision(3);
    if (el._lastVal !== displayValue) {
        el.textContent = displayValue;  // Changed to textContent
        el._lastVal = displayValue;
    }
    
    requestAnimationFrame(gameLoop);
}

let lastTime;
requestAnimationFrame(gameLoop);
