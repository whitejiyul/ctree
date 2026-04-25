// [레이어 0: 시작점 및 게임의 목표]
addLayer("m", {
    name: "main",
    symbol: "M", 
    position: 0, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#FFFFFF",
    resource: "의지", 
    type: "none", // 자원을 소모해서 구매하는 것이 아니라 진행도를 보여주는 역할
    row: 0,
    column: 0,
    layerShown() { return true },
    
    // 게임의 목표를 상단에 표시
    tabFormat: [
        "main-display",
        ["display-text", function() { return "<h3>게임의 목표: 하늘(S) 레이어에 도달하여 천공의 정수를 손에 넣으세요.</h3>" }],
        "blank",
        "upgrades",
    ],

    upgrades: {
        11: {
            title: "노동의 시작",
            description: "포인트를 벌기 시작합니다. (초당 +1)",
            cost: new Decimal(0), // 처음엔 공짜로 구매
        },
        12: {
            title: "한계 돌파",
            description: "프레스티지(P) 레이어를 해금합니다.",
            cost: new Decimal(10),
            currencyInternalName: "points", // 포인트를 사용하여 구매
            unlocked() { return hasUpgrade('m', 11) }
        },
        13: {
            title: "효율 개선",
            description: "포인트 생산량이 2배가 됩니다.",
            cost: new Decimal(50),
            currencyInternalName: "points",
            unlocked() { return hasUpgrade('m', 12) }
        },
        14: {
            title: "의지의 힘",
            description: "의지 수치(이 레이어의 포인트)에 따라 포인트 생산량이 증가합니다.",
            cost: new Decimal(200),
            currencyInternalName: "points",
            effect() { return player.m.points.add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect('m', 14))+"x" },
            unlocked() { return hasUpgrade('m', 13) }
        },
        15: {
            title: "까마귀의 인도",
            description: "까마귀(C) 레이어 해금 조건을 완화합니다.",
            cost: new Decimal(1000),
            currencyInternalName: "points",
            unlocked() { return hasUpgrade('m', 14) }
        }
    }
});

// [레이어 1: 프레스티지 (피)]
addLayer("p", {
    name: "prestige", 
    symbol: "P", 
    position: 1, 
    startData() { return {
        unlocked: false, // 처음엔 잠겨있음
        points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), 
    resource: "프레스티지 포인트", 
    baseResource: "포인트", 
    baseAmount() { return player.points }, 
    type: "normal", 
    exponent: 0.5, 
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    row: 0,
    // 시작점(m) 레이어의 12번 업그레이드를 사야만 나타남
    layerShown() { return hasUpgrade('m', 12) || player.p.unlocked },
});
