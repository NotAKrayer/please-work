function updateUI() {
    document.getElementById("matterCurrency").innerHTML = player.matter.toPrecision(3);
    document.getElementById("matterUpgrade1Cost").textContent = player.matterUpgrade[0].cost.toPrecision(3);
    document.getElementById("matterUpgrade1Effect").textContent = player.matterUpgrade[0].effect.toPrecision(3);
    document.getElementById("matterUpgrade1Power").textContent = player.matterUpgrade[0].power.toPrecision(3);
    document.getElementById("matterUpgrade2Cost").textContent = player.matterUpgrade[1].cost.toPrecision(3);
    document.getElementById("matterUpgrade2Effect").textContent = player.matterUpgrade[1].effect.toPrecision(3);
    if (player.annihilate.amount < player.annihilate.cost.length) {
        document.getElementById("annCost").innerHTML = player.annihilate.cost[player.annihilate.amount].toPrecision(3);
        document.getElementById("annText").innerHTML = player.annihilate.upgrades[player.annihilate.amount]
        document.getElementById("annValue").innerHTML = player.annihilate.value[player.annihilate.amount] || "No More Upgrades";
    } else {
        document.getElementById("annCost").innerHTML = player.annihilate.costAfter.toPrecision(3);
        document.getElementById("annText").innerHTML = "No More Upgrades";
        document.getElementById("annValue").innerHTML = player.annihilate.valueAfter
    }

}

function saveGame() {
    const saveData = JSON.stringify(player, (key, value) => {
        if (value instanceof Decimal) {
            return { type: 'Decimal', data: value.toString() };
        }
        return value;
    });
    localStorage.setItem('saveData', saveData);
}

function loadGame() {
    const saveData = localStorage.getItem('saveData');
    if (!saveData) {
        return;
    }
    const loadedData = JSON.parse(saveData, (key, value) => {
        if (value && value.type === 'Decimal') {
            return new Decimal(value.data);
        }
        return value;
    });

    player = loadedData;

    player.matter = new Decimal(player.matter);
    for (let upgrade of player.matterUpgrade) {
        upgrade.cost = new Decimal(upgrade.cost);
        upgrade.amount = new Decimal(upgrade.amount);
        upgrade.effect = new Decimal(upgrade.effect);
        upgrade.power = new Decimal(upgrade.power);
        upgrade.scale = new Decimal(upgrade.scale);
    }
    player.annihilate.effect = new Decimal(player.annihilate.effect);
    player.annihilate.costAfter = new Decimal(player.annihilate.costAfter);
    player.annihilate.valueAfter = new Decimal(player.annihilate.valueAfter)

    if (player.matterUpgrade[1].unlocked == 1) {
        document.querySelector('.mu2').classList.add('visible');
    }
    updateUI();
}

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    if (!localStorage.getItem('saveData')) {
        player = {
            matter: new Decimal(0),
            tickspeed: 1000,
            matterUpgrade: [
                { cost: new Decimal(10), amount: new Decimal(0), effect: new Decimal(0), power: new Decimal(1), unlocked: 1, scale: new Decimal(1) },
                { cost: new Decimal(100), amount: new Decimal(0), effect: new Decimal(1), power: new Decimal(1), unlocked: 0, scale: new Decimal(1) }
            ],
            annihilate: {
                amount: 0,
                costAfter: new Decimal(2500),
                valueAfter: new Decimal(3),
                cost: [new Decimal(100), new Decimal(1500), new Decimal(2500)],
                effect: new Decimal(1),
                upgrades: ["Unlock New Matter Upgrade", "Unlock Another Matter Upgrade, 20% Weaker Upgrade 1 Scaling"],
                value: [1, 2, 3],
            }
        };
    }
    if (player.matterUpgrade[1].unlocked == 1) {
        document.querySelector('.mu2').classList.add('visible');
    }
    updateUI();
    openTab('matter');
    openSubTab('matterUpgrades');
});

function autoSave() {
    saveGame();
}

setInterval(autoSave, 30000);

window.addEventListener('beforeunload', () => {
    saveGame();
});

function exportSave() {
    const saveData = JSON.stringify(player, (key, value) => {
        if (value instanceof Decimal) {
            return { type: 'Decimal', data: value.toString() };
        }
        return value;
    });

    const base64Save = btoa(unescape(encodeURIComponent(saveData)));

    return base64Save;
}

function importSave(base64Save) {
    try {
        const saveData = decodeURIComponent(escape(atob(base64Save)));
        const loadedData = JSON.parse(saveData, (key, value) => {
            if (value && value.type === 'Decimal') {
                return new Decimal(value.data);
            }
            return value;
        });

        player = loadedData;

        if (player.matterUpgrade[1].unlocked == 1) {
            document.querySelector('.mu2').classList.add('visible');
        }
        player.matter = new Decimal(player.matter);
        for (let upgrade of player.matterUpgrade) {
            upgrade.cost = new Decimal(upgrade.cost);
            upgrade.amount = new Decimal(upgrade.amount);
            upgrade.effect = new Decimal(upgrade.effect);
            upgrade.power = new Decimal(upgrade.power);
            upgrade.scale = new Decimal(upgrade.scale);
        }
        player.annihilate.effect = new Decimal(player.annihilate.effect);
        player.annihilate.costAfter = new Decimal(player.annihilate.costAfter);
        player.annihilate.valueAfter = new Decimal(player.annihilate.valueAfter)

        updateUI();
        return true;
    } catch (error) {
        return false;
    }

}

function handleImport() {
    const importString = document.getElementById('importExportField').value;
    if (importSave(importString)) {
        alert('Save Import Successfully!');
    } else {
        alert('Error while Importing.');
    }
}

function handleExport() {
    const exportString = exportSave();
    document.getElementById('importExportField').value = exportString;
    alert('Save Exported! Copy from text field.');
}


function confirmReset() {
    document.getElementById('resetModal').style.display = 'block';
}

function closeResetModal() {
    document.getElementById('resetModal').style.display = 'none';
}

function handleReset() {
    const input = document.getElementById('resetInput').value;
    if (input === 'I understand what i do') {
        resetGame();
        closeResetModal();
        openTab('matter')
        updateUI();
        openSubTab('matterUpgrades')
    }
}

function resetGame() {
    localStorage.removeItem('saveData');
    player = {
        matter: new Decimal(0),
        tickspeed: 1000,
        matterUpgrade: [
            { cost: 10, amount: 0, effect: 0, power: 1, unlocked: 1, scale: 1 },
            { cost: 100, amount: 0, effect: 1, power: 1, unlocked: 0, scale: 1 }
        ],
        annihilate: {
            amount: 0,
            costAfter: new Decimal(2500),
            valueAfter: 3,
            cost: [100, 1500, 2500],
            effect: 1,
            upgrades: ["Unlock New Matter Upgrade", "Unlock Another Matter Upgrade, 20% Weaker Upgrade 1 Scaling"],
            value: [1, 2, 3],
        }
    };
    document.querySelector('.mu2').classList.remove('visible');
    console.log('Игра сброшена!');
}