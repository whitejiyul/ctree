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
    type: "none",
    row: 0,
    layerShown() { return true },

    // [UI 구분 기능] - 업그레이드를 섹션별로 나눕니다.
    tabFormat: [
        "main-display",
        "blank",
        ["display-text", "<h2>[ 단계 1: 시스템 가동 ]</h2>"],
        ["upgrades", [11, 12]], // 첫 번째 줄: 시스템 시작 및 해금
        "blank",
        ["display-text", "<h2>[ 단계 2: 생산력 강화 ]</h2>"],
        ["upgrades", [13, 14, 15]], // 두 번째 줄: 포인트 증폭
    ],

    upgrades: {
        11: {
            title: "엔진 점화",
            description: "포인트 생산을 시작합니다. (초당 +1)",
            cost: new Decimal(0), // 무료
        },
        12: {
            title: "데이터 압축",
            description: "프레스티지(P) 레이어를 해금합니다.",
            cost: new Decimal(10),
            currencyInternalName: "points",
            unlocked() { return hasUpgrade('m', 11) }
        },
        13: {
            title: "출력 증강",
            description: "포인트 생산량이 2배가 됩니다.",
            cost: new Decimal(50),
            currencyInternalName: "points",
            unlocked() { return hasUpgrade('m', 12) }
        },
        14: {
            title: "자기 공명",
            description: "보유한 포인트에 비례하여 생산량이 늘어납니다.",
            cost: new Decimal(250),
            currencyInternalName: "points",
            effect() { return player.points.add(1).log10().add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect('m', 14))+"x" },
            unlocked() { return hasUpgrade('m', 13) }
        },
        15: {
            title: "까마귀의 신호",
            description: "다음 콘텐츠(C)를 위한 준비를 마칩니다.",
            cost: new Decimal(1000),
            currencyInternalName: "points",
            unlocked() { return hasUpgrade('m', 14) }
        }
    }
});

// 프레스티지 레이어 (P)
addLayer("p", {
    name: "prestige", 
    symbol: "P", 
    position: 1, 
    startData() { return {
        unlocked: false,
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
    layerShown() { return hasUpgrade('m', 12) || player.p.unlocked },
});
