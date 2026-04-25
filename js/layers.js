// Prestige 레이어 (기존 '피' 레이어 확장)
addLayer("p", {
    name: "prestige", 
    symbol: "P", 
    position: 0, 
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), 
    resource: "prestige points", 
    baseResource: "points", 
    baseAmount() {return player.points}, 
    type: "normal", 
    exponent: 0.5, 
    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        return mult
    },
    gainExp() { return new Decimal(1) },
    row: 0,
    upgrades: {
        11: {
            title: "기초 강화",
            description: "포인트 생산량을 2배로 늘립니다.",
            cost: new Decimal(1),
        },
        12: {
            title: "까마귀의 부름",
            description: "까마귀 레이어를 해금할 준비를 합니다. (포인트 생산 1.5배)",
            cost: new Decimal(5),
        },
        13: {
            title: "에너지 순환",
            description: "포인트에 비례해 프레스티지 포인트 획득량이 늘어납니다.",
            cost: new Decimal(20),
            effect() { return player.points.add(1).log10().add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
    layerShown(){return true}
})

// 새로운 레이어: 까마귀 (Crow)
addLayer("c", {
    name: "crow", 
    symbol: "C", 
    position: 1, // Prestige 옆에 위치
    startData() { return {
        unlocked: false, // 처음엔 잠겨 있음
		points: new Decimal(0),
    }},
    color: "#333333", // 까마귀색 (어두운 회색)
    requires: new Decimal(100), 
    resource: "crows", 
    baseResource: "prestige points", // 프레스티지 포인트를 소모
    baseAmount() {return player.p.points}, 
    type: "static", // 고정 비용 방식 (전략적 재미 추가)
    base: 1.5,
    exponent: 1.1, 
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    row: 0, 
    // 해금 조건: 프레스티지 업그레이드 12번을 샀을 때 보임
    layerShown(){return hasUpgrade('p', 12) || player.c.unlocked},
    
    upgrades: {
        11: {
            title: "까마귀의 깃털",
            description: "까마귀 한 마리당 포인트 생산량이 20%씩 증가합니다.",
            cost: new Decimal(1),
            effect() { return player.c.points.times(0.2).add(1) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
})
