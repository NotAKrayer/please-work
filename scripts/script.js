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
        {cost: 10, amount: 0, effect: 0, power: 1, unlocked: 1, scale: 1},
        {cost: 100, amount: 0, effect: 1, power: 1, unlocked: 0, scale: 1}
    ],
    annihilate: {
        amount: 0,
        costAfter: 2500,
        valueAfter: 3,
        cost: [100, 1500, 2500],
        effect: 1,
        upgrades: ["Unlock New Matter Upgrade", "Unlock Another Matter Upgrade, 20% Weaker Upgrade 1 Scaling"],
        value: [1, 2, 3],
    }
}

function matterUpgradeBuy(id) {
    if (player.matter.gte(player.matterUpgrade[id - 1].cost)) {
        player.matter = player.matter.minus(player.matterUpgrade[id - 1].cost);

        const element = document.getElementById(upgradeEl[id - 1]);
        const hasScale = element.textContent.includes("High") || element.textContent.includes("Extreme");

        if (id == 1) {
            player.matterUpgrade[0].effect = new Decimal(player.matterUpgrade[0].effect).plus(player.matterUpgrade[0].power)
            player.matterUpgrade[0].cost = new Decimal(player.matterUpgrade[0].cost).mul(1.5).mul(hasScale ? player.matterUpgrade[0].scale : 1);
            player.matterUpgrade[0].amount = new Decimal(player.matterUpgrade[0].amount).plus(1);
        } else if (id == 2) {
            player.matterUpgrade[1].amount = new Decimal(player.matterUpgrade[1].amount).plus(1);
            player.matterUpgrade[1].effect = new Decimal(player.matterUpgrade[1].effect).plus(player.matterUpgrade[1].power)
            player.matterUpgrade[1].cost = new Decimal(player.matterUpgrade[1].cost).mul(4).mul(hasScale ? player.matterUpgrade[1].scale : 1);
            player.matterUpgrade[0].power = new Decimal(player.matterUpgrade[0].power).plus(player.matterUpgrade[1].power);
            player.matterUpgrade[0].effect = new Decimal(player.matterUpgrade[0].amount).mul(player.matterUpgrade[0].power)
        }
        document.getElementById("matterCurrency").innerHTML = player.matter.toPrecision(3);
        document.getElementById("matterUpgrade1Cost").textContent = player.matterUpgrade[0].cost.toPrecision(3);
        document.getElementById("matterUpgrade1Effect").textContent = player.matterUpgrade[0].effect.toPrecision(3);
        document.getElementById("matterUpgrade1Power").textContent = player.matterUpgrade[0].power.toPrecision(3);
        document.getElementById("matterUpgrade2Cost").textContent = player.matterUpgrade[1].cost.toPrecision(3);
        document.getElementById("matterUpgrade2Effect").textContent = player.matterUpgrade[1].effect.toPrecision(3);
    }

    matterScaling();
}

function annUp() {
    if (player.annihilate.amount < player.annihilate.cost.length && player.matter.gte(player.annihilate.cost[player.annihilate.amount]))
         {
        if (player.annihilate.amount == 1) {
            player.matterUpgrade[0].scale = new Decimal(player.matterUpgrade[0].scale).mul(0.8);
        }
        
        player.matter = new Decimal(0);
        player.matterUpgrade = [
            {cost: 10, amount: 0, effect: 0, power: 1, unlocked: 1, scale: player.matterUpgrade[0].scale},
            {cost: 100, amount: 0, effect: 1, power: 1, unlocked: 0, scale: player.matterUpgrade[1].scale}
        ];

        player.annihilate.amount = new Decimal(player.annihilate.amount).plus(1);
        player.annihilate.effect = new Decimal(player.annihilate.effect).mul(1.5); // Увеличение эффекта

        // Проверяем, достигнут ли конец списка улучшений
        let upgradeText = player.annihilate.amount <= player.annihilate.upgrades.length 
            ? player.annihilate.upgrades[player.annihilate.amount] 
            : "No More Upgrades"

        document.getElementById("annText").innerHTML = upgradeText;

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

function annUpAfter() {
    if (player.matter.gte(player.annihilate.costAfter)) {
        
        player.matter = new Decimal(0);
        player.matterUpgrade = [
            {cost: 10, amount: 0, effect: 0, power: 1, unlocked: 1, scale: player.matterUpgrade[0].scale},
            {cost: 100, amount: 0, effect: 1, power: 1, unlocked: 0, scale: player.matterUpgrade[1].scale}
        ];

        player.annihilate.amount = new Decimal(player.annihilate.amount).plus(1);
        player.annihilate.effect = new Decimal(player.annihilate.effect).mul(1.5); // Увеличение эффекта

        // Проверяем, достигнут ли конец списка улучшений
        let upgradeText = "No More Upgrades";

        document.getElementById("annText").innerHTML = upgradeText;

        player.annihilate.costAfter = new Decimal(player.annihilate.costAfter).mul(2);
        player.annihilate.valueAfter = new Decimal(player.annihilate.valueAfter).add(1);

        document.getElementById("annCost").innerHTML = player.annihilate.costAfter.toPrecision(3)
        document.getElementById("annValue").innerHTML = player.annihilate.valueAfter;

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

function chooseAnn() {
    if (player.annihilate.amount < player.annihilate.cost.length - 1) { // Используем длину массива cost
        annUp();
    } else {
        annUpAfter();
    }
}

let prefixes = ["High", "Extreme", "Absolute"];
//let prefixesLevel = [20, 45, 75, 100]; stuff for scaling
let upgradeEl = ["mu1scale", "mu2scale"]

function matterScaling() {
    const thresholds = [20, 45]; // Пороги для уровней
    const multipliers = [1, 2, 4]; // Множители для каждого уровня (0, 1, 2)

    for (let i = 0; i < 2; i++) {
        const element = document.getElementById(upgradeEl[i]);
        const currentAmount = player.matterUpgrade[i].amount // Предполагая, что amount - Decimal

        // Определение текущего уровня
        let level = 0;
        if (currentAmount >= thresholds[1]) level = 2;
        else if (currentAmount >= thresholds[0]) level = 1;

        // Установка масштаба на основе уровня
        player.matterUpgrade[i].scale = new Decimal(multipliers[level])

        // Обновление префикса
        if (!element.dataset.baseName) {
            element.dataset.baseName = element.textContent;
        }
        element.textContent = level > 0 
            ? `${prefixes[level - 1]} ${element.dataset.baseName}` 
            : element.dataset.baseName;
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
    
    player.matter = new Decimal(player.matter).plus(e.mul(deltaTime/1000));
    
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
