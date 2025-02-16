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
        {cost: 100, amount: 0, effect: 0, power: 1, unlocked: 0, scale: 1},
        {cost: 1000, amount: 0, effect: 0, power: 1, unlocked: 0, scale: 1}
    ],
    annihilate: {
        amount: 0,
        costAfter: 2500,
        valueAfter: 3,
        cost: [100, 1.00e3, 2.50e3],
        effect: 1,
        upgrades: ["Unlock New Matter Upgrade", "Unlock Another Matter Upgrade, 20% Weaker Upgrade 1 Scaling",
            "Change Upgrade 2 Power from +1 to x1"
        ],
        value: [1, 2, 3],
        scaling: [1, 1, 1]
    }
}

function matterUpgradeBuy(id) {
    if (player.matter.gte(player.matterUpgrade[id - 1].cost)) {
        player.matter = player.matter.minus(player.matterUpgrade[id - 1].cost);

        const element = document.getElementById(upgradeEl[id - 1]);
        const hasScale = element.textContent.includes("High") || element.textContent.includes("Extreme");

        if (id == 1) {
            player.matterUpgrade[0].effect = new Decimal(player.matterUpgrade[0].effect).plus(player.matterUpgrade[0].power)
            player.matterUpgrade[0].cost = new Decimal(player.matterUpgrade[0].cost).mul(1.5).pow(hasScale ? player.matterUpgrade[0].scale : 1);
            player.matterUpgrade[0].amount = new Decimal(player.matterUpgrade[0].amount).plus(1);
        } else if (id == 2) {
            player.matterUpgrade[1].amount = new Decimal(player.matterUpgrade[1].amount).plus(1);
            if (player.annihilate.amount < 3) {
                player.matterUpgrade[1].effect = new Decimal(player.matterUpgrade[1].effect).plus(player.matterUpgrade[1].power)
            } else {
                player.matterUpgrade[1].effect = new Decimal(player.matterUpgrade[1].effect).mul(player.matterUpgrade[1].power)
            }
            player.matterUpgrade[1].cost = new Decimal(player.matterUpgrade[1].cost).mul(4).pow(hasScale ? player.matterUpgrade[1].scale : 1);
            player.matterUpgrade[0].power = new Decimal(player.matterUpgrade[0].power).plus(player.matterUpgrade[1].power);
            player.matterUpgrade[0].effect = new Decimal(player.matterUpgrade[0].amount).mul(player.matterUpgrade[0].power)
        } else if (id == 3) {
            player.matterUpgrade[2].amount = new Decimal(player.matterUpgrade[2].amount).plus(1);
            player.matterUpgrade[2].effect = new Decimal(player.matterUpgrade[2].effect).plus(player.matterUpgrade[2].power);
            player.matterUpgrade[2].cost = new Decimal(player.matterUpgrade[2].cost).mul(8).pow(hasScale ? player.matterUpgrade[2].scale : 1);
            player.matterUpgrade[1].power = new Decimal(player.matterUpgrade[1].power).plus(player.matterUpgrade[2].power);
            if (player.annihilate.amount < 3) {
                player.matterUpgrade[1].effect = new Decimal(player.matterUpgrade[1].amount).mul(player.matterUpgrade[1].power);
            } else {
                player.matterUpgrade[1].effect = new Decimal(player.matterUpgrade[1].effect).mul(player.matterUpgrade[1].power);
            }
        }

        document.getElementById("matterCurrency").innerHTML = player.matter.toPrecision(3);
        document.getElementById("matterUpgrade1Cost").textContent = player.matterUpgrade[0].cost.toPrecision(3);
        document.getElementById("matterUpgrade1Effect").textContent = player.matterUpgrade[0].effect.toPrecision(3);
        document.getElementById("matterUpgrade1Power").textContent = player.matterUpgrade[0].power.toPrecision(3);
        document.getElementById("matterUpgrade2Cost").textContent = player.matterUpgrade[1].cost.toPrecision(3);
        document.getElementById("matterUpgrade2Effect").textContent = player.matterUpgrade[1].effect.toPrecision(3);
        document.getElementById("matterUpgrade2Power").innerHTML = player.matterUpgrade[1].power.toPrecision(3);
        document.getElementById("matterUpgrade3Cost").textContent = player.matterUpgrade[2].cost.toPrecision(3);
        document.getElementById("matterUpgrade3Effect").textContent = player.matterUpgrade[2].effect.toPrecision(3);
    }

    matterScaling();
}

let prefixes = ["High", "Extreme", "Absolute"];
//let prefixesLevel = [10 (20), 30 (45), 75, 100]; stuff for scaling
let upgradeEl = ["mu1scale", "mu2scale", "mu3scale"]

function matterScaling() {
    const thresholds = [10, 30]; // Пороги для уровней
    const multipliers = [1, 2, 4]; // Множители для каждого уровня (0, 1, 2)

    for (let i = 0; i < 3; i++) {
        const element = document.getElementById(upgradeEl[i]);
        const currentAmount = player.matterUpgrade[i].amount // Предполагая, что amount - Decimal

        const hasScale = element.textContent.includes("High") || element.textContent.includes("Extreme");

        // Определение текущего уровня
        let level = 0;
        if (currentAmount >= thresholds[1]) level = 2;
        else if (currentAmount >= thresholds[0]) level = 1;

        if (hasScale) {
            player.matterUpgrade[i].scale = new Decimal(multipliers[level]).mul(player.annihilate.scaling[i])
        }

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
