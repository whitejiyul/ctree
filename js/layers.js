// --- Row 0: 기초 레이어 (Core) ---
addLayer("c", {
    name: "Core", 
    symbol: "C", 
    position: 0, 
    row: 0, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), 
    resource: "core energy", 
    baseResource: "points", 
    baseAmount() {return player.points}, 
    type: "normal", 
    exponent: 0.5, 
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { return new Decimal(1) },
    layerShown(){return true}
})

// --- Row 1: 발전 레이어 (Prestige & Booster) ---
// 요청대로 Prestige를 Row 1에 배치
addLayer("p", {
    name: "Prestige",
    symbol: "P",
    position: 0,
    row: 1,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(100), // Core Energy가 100개 필요
    resource: "prestige points",
    baseResource: "core energy",
    baseAmount() { return player.c.points },
    type: "normal",
    exponent: 0.5,
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    upgrades: {
        11: {
            title: "Point Multiplier",
            description: "기본 포인트 생산량을 2배로 늘립니다.",
            cost: new Decimal(1),
        },
        12: {
            title: "Core Boost",
            description: "프레스티즈 포인트가 Core Energy 생산량을 강화합니다.",
            cost: new Decimal(5),
            effect() { return player.p.points.add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
    layerShown() { return player.c.unlocked }
})

addLayer("b", {
    name: "Booster",
    symbol: "B",
    position: 1,
    row: 1,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#3366FF",
    requires: new Decimal(200),
    resource: "boosters",
    baseResource: "core energy",
    baseAmount() { return player.c.points },
    type: "static", // 개수가 정해진 강력한 레이어
    exponent: 1.5,
    gainMult() { return new Decimal(1) },
    layerShown() { return player.c.points.gte(50) || player.b.unlocked }
})

// --- Row 2: 통합 레이어 (Mega) ---
addLayer("m", {
    name: "Mega",
    symbol: "M",
    position: 0,
    row: 2,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#AA00FF",
    requires: new Decimal(10), // Booster 10개 필요
    resource: "mega points",
    baseResource: "boosters",
    baseAmount() { return player.b.points },
    type: "normal",
    exponent: 0.4,
    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade('p', 12)) mult = mult.times(2) // P 레이어와의 시너지
        return mult
    },
    layerShown() { return player.p.unlocked && player.b.unlocked }
})
