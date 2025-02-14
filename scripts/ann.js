function annUp() {
    if (player.annihilate.amount < player.annihilate.cost.length && player.matter.gte(player.annihilate.cost[player.annihilate.amount]))
         {
        if (player.annihilate.amount == 1) {
            player.annihilate.scaling[0] = new Decimal(player.annihilate.scaling[0]).mul(0.8);
        }
        
        player.matter = new Decimal(0);
        player.matterUpgrade = [
            {cost: 10, amount: 0, effect: 0, power: 1, unlocked: 1, scale: player.matterUpgrade[0].scale},
            {cost: 100, amount: 0, effect: 1, power: 1, unlocked: 0, scale: player.matterUpgrade[1].scale},
            {cost: 1000, amount: 0, effect: 1, power: 1, unlocked: 0, scale: player.matterUpgrade[2].scale}
        ];

        player.annihilate.amount = new Decimal(player.annihilate.amount).plus(1);
        player.annihilate.effect = new Decimal(player.annihilate.effect).mul(1.5); // Увеличение эффекта

        // Проверяем, достигнут ли конец списка улучшений
        let upgradeText = player.annihilate.amount < player.annihilate.upgrades.length 
            ? player.annihilate.upgrades[player.annihilate.amount] 
            : "No More Upgrades"

        document.getElementById("annText").innerHTML = upgradeText;

        document.getElementById("mu1scale").innerHTML = "Matter Stability";
        document.getElementById("mu2scale").innerHTML = "Matter Temperature";

        document.getElementById("annCost").innerHTML = player.annihilate.cost[player.annihilate.amount];
        document.getElementById("annValue").innerHTML = player.annihilate.value[player.annihilate.amount];

        document.getElementById("matterUpgrade1Cost").innerHTML = player.matterUpgrade[0].cost.toPrecision(3);
        document.getElementById("matterUpgrade1Effect").innerHTML = player.matterUpgrade[0].effect.toPrecision(3);
        document.getElementById("matterUpgrade1Power").innerHTML = player.matterUpgrade[0].power.toPrecision(3);
        document.getElementById("matterUpgrade2Cost").innerHTML = player.matterUpgrade[1].cost.toPrecision(3);
        document.getElementById("matterUpgrade2Power").innerHTML = player.matterUpgrade[1].power.toPrecision(3);
        document.getElementById("matterUpgrade2Effect").innerHTML = player.matterUpgrade[1].effect.toPrecision(3);
        document.getElementById("matterUpgrade3Cost").innerHTML = player.matterUpgrade[2].cost.toPrecision(3);
        document.getElementById("matterUpgrade3Effect").innerHTML = player.matterUpgrade[2].effect.toPrecision(3);

        if (player.annihilate.amount > 0) {
            document.querySelector('.mu2').classList.add('visible');
            player.matterUpgrade[1].unlocked = 1;
        }

        if (player.annihilate.amount > 1) {
            document.querySelector('.mu3').classList.add('visible');
            player.matterUpgrade[2].unlocked = 1;
        }
    }
}

function annUpAfter() {
    if (player.matter.gte(player.annihilate.costAfter)) {
        
        player.matter = new Decimal(0);
        player.matterUpgrade = [
            {cost: 10, amount: 0, effect: 0, power: 1, unlocked: 1, scale: player.matterUpgrade[0].scale},
            {cost: 100, amount: 0, effect: 1, power: 1, unlocked: 0, scale: player.matterUpgrade[1].scale},
            {cost: 1000, amount: 0, effect: 1, power: 1, unlocked: 0, scale: player.matterUpgrade[2].scale}
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

        document.getElementById("mu1scale").innerHTML = "Matter Stability";
        document.getElementById("mu2scale").innerHTML = "Matter Temperature";

        document.getElementById("matterUpgrade1Cost").innerHTML = player.matterUpgrade[0].cost.toPrecision(3);
        document.getElementById("matterUpgrade1Effect").innerHTML = player.matterUpgrade[0].effect.toPrecision(3);
        document.getElementById("matterUpgrade1Power").innerHTML = player.matterUpgrade[0].power.toPrecision(3);
        document.getElementById("matterUpgrade2Cost").innerHTML = player.matterUpgrade[1].cost.toPrecision(3);
        document.getElementById("matterUpgrade2Effect").innerHTML = player.matterUpgrade[1].effect.toPrecision(3);
        document.getElementById("matterUpgrade2Power").innerHTML = player.matterUpgrade[1].power.toPrecision(3);
        document.getElementById("matterUpgrade3Cost").innerHTML = player.matterUpgrade[2].cost.toPrecision(3);
        document.getElementById("matterUpgrade3Effect").innerHTML = player.matterUpgrade[2].effect.toPrecision(3);

        if (player.annihilate.amount > 0) {
            document.querySelector('.mu2').classList.add('visible');
            player.matterUpgrade[1].unlocked = 1;
        }

        if (player.annihilate.amount > 1) {
            document.querySelector('.mu3').classList.add('visible');
            player.matterUpgrade[2].unlocked = 1;
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