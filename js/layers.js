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

    // [UI 구분 기능] - 섹션별로 나누어 보기 좋게 만듦
    tabFormat: [
        "main-display",
        "blank",
        ["display-text", "<h3>[ 단계 1: 시스템 가동 ]</h3>"],
        "blank",
        ["upgrades", [11, 12]], 
        "blank",
        ["display-text", "<h3>[ 단계 2: 생산력 증폭 ]</h3>"],
        "blank",
        ["upgrades", [13, 14, 15]],
    ],

    upgrades: {
        11: {
            title: "엔진 점화",
            description: "드디어 돈이 벌리기 시작합니다. (초당 +1)",
            cost: new Decimal(0), // 무료
        },
        12: {
            title: "피의 계약",
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
            description: "현재 포인트에 비례해 생산량이 증가합니다.",
            cost: new Decimal(250),
            currencyInternalName: "points",
            effect() { return player.points.add(1).log10().add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect('m', 14))+"x" },
            unlocked() { return hasUpgrade('m', 13) }
        },
        15: {
            title: "까마귀의 부름",
            description: "까마귀 레이어를 위한 준비를 마칩니다.",
            cost: new Decimal(1000),
            currencyInternalName: "points",
            unlocked() { return hasUpgrade('m', 14) }
        }
    }
});

addLayer("p", {
    name: "prestige", 
    symbol: "P", 
    position: 1, 
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#4BDC13",
    requires: new Decimal(10), 
    resource: "프레스티지 포인트", 
    baseResource: "포인트", 
    baseAmount() { return player.points }, 
    type: "normal", 
    exponent: 0.5, 
    row: 0,
    layerShown() { return hasUpgrade('m', 12) || player.p.unlocked },
});
