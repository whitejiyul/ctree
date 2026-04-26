addLayer("p", {
    name: "Prestige",
    symbol: "P",
    position: 0,
    row: 0,
    startData() { return { unlocked: true, points: new Decimal(0) }},
    color: "#4BDC13",
    requires: new Decimal(10),
    resource: "prestige points",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.5,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    layerShown() { return true }
})
// 첫 번째 레이어 (컨텐츠 1)
addLayer("b", {
    name: "Booster",
    symbol: "B",
    position: 0,
    row: 1,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#3366FF",
    requires: new Decimal(100), // P-points 100개 필요
    resource: "boosters",
    baseResource: "prestige points",
    baseAmount() { return player.p.points },
    type: "static", // 개수가 정해진 형태
    exponent: 1.2,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    layerShown() { return player.p.unlocked }
})

// 두 번째 레이어 (컨텐츠 2)
addLayer("g", {
    name: "Generator",
    symbol: "G",
    position: 1,
    row: 1,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#FF9900",
    requires: new Decimal(200),
    resource: "generators",
    baseResource: "prestige points",
    baseAmount() { return player.p.points },
    type: "static",
    exponent: 1.3,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    layerShown() { return player.p.unlocked }
})
addLayer("m", {
    name: "Mega",
    symbol: "M",
    position: 0,
    row: 2,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#AA00FF",
    requires: new Decimal(10), // Booster 10개 필요 (예시)
    resource: "mega points",
    baseResource: "boosters",
    baseAmount() { return player.b.points },
    type: "normal",
    exponent: 0.4,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    layerShown() { return player.b.unlocked || player.g.unlocked }
})
