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
    resource: "프레스티지 포인트", 
    baseResource: "포인트", 
    baseAmount() {return player.points}, 
    type: "normal", 
    exponent: 0.5, 
    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade('p', 21)) mult = mult.times(upgradeEffect('p', 21))
        if (hasUpgrade('c', 11)) mult = mult.times(upgradeEffect('c', 11))
        return mult
    },
    gainExp() { return new Decimal(1) },
    row: 0,
    upgrades: {
        // [포인트 강화 10개]
        11: { title: "기초", description: "포인트 생산 +1", cost: new Decimal(1) },
        12: { title: "가속", description: "포인트 2배", cost: new Decimal(10) },
        13: { title: "증폭", description: "포인트 3배", cost: new Decimal(50) },
        14: { title: "심화", description: "포인트 5배", cost: new Decimal(200) },
        15: { title: "까마귀 해금", description: "까마귀 레이어를 해금합니다.", cost: new Decimal(500) },
        16: { title: "로그 생산", description: "포인트에 비례해 생산량 증가", cost: new Decimal(2000),
              effect() { return player.points.add(1).log10().add(1) },
              effectDisplay() { return format(upgradeEffect('p', 16))+"x" } },
        17: { title: "깃털 준비", description: "깃털 레이어 해금 준비", cost: new Decimal(10000) },
        18: { title: "분열", description: "포인트 10배", cost: new Decimal(50000) },
        19: { title: "융합", description: "포인트 20배", cost: new Decimal(250000) },
        20: { title: "포인트 신", description: "포인트 100배", cost: new Decimal(1000000) },
        // [프레스티지 강화 10개]
        21: { title: "혈액 순환", description: "포인트로 프레스티지 증가", cost: new Decimal(20),
              effect() { return player.points.add(1).log10().add(1).pow(0.5) },
              effectDisplay() { return format(upgradeEffect('p', 21))+"x" } },
        22: { title: "압축", description: "요구치 10% 감소", cost: new Decimal(150) },
        23: { title: "응축", description: "프레스티지 2배", cost: new Decimal(1000) },
        24: { title: "재생", description: "프레스티지 3배", cost: new Decimal(5000) },
        25: { title: "전이", description: "까마귀가 프레스티지를 강화합니다.", cost: new Decimal(20000),
              effect() { if(player.c.unlocked) return player.c.points.add(1).pow(0.2); return new Decimal(1) } },
        26: { title: "안정", description: "프레스티지 5배", cost: new Decimal(100000) },
        27: { title: "자동화", description: "프레스티지 포인트 자동 획득", cost: new Decimal(500000) },
        28: { title: "폭발", description: "프레스티지 10배", cost: new Decimal(2500000) },
        29: { title: "둥지 보너스", description: "둥지에 비례해 프레스티지 증가", cost: new Decimal(1e7) },
        30: { title: "프레스티지 마스터", description: "프레스티지 100배", cost: new Decimal(1e8) }
    },
    layerShown(){return true}
});

addLayer("c", {
    name: "crow", symbol: "C", position: 1, 
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#333333", requires: new Decimal(10), 
    resource: "까마귀", baseResource: "프레스티지 포인트", 
    baseAmount() {return player.p.points}, 
    type: "static", base: 1.5, exponent: 1.1, row: 0, 
    layerShown(){return hasUpgrade('p', 15) || player.c.unlocked},
    upgrades: {
        11: { title: "까마귀 군단", description: "프레스티지 생산량 증가", cost: new Decimal(2),
              effect() { return player.c.points.add(1).pow(0.5) } }
    }
});

addLayer("f", {
    name: "feather", symbol: "F", position: 0,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#FFFFFF", requires: new Decimal(1000),
    resource: "깃털", baseResource: "포인트",
    baseAmount() {return player.points},
    type: "normal", exponent: 0.4, row: 1,
    layerShown() { return hasUpgrade('p', 17) || player.f.unlocked }
});

addLayer("n", {
    name: "nest", symbol: "N", position: 1,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#8B4513", requires: new Decimal(100),
    resource: "둥지", baseResource: "깃털",
    baseAmount() {return player.f.points},
    type: "static", row: 1,
    layerShown() { return player.f.unlocked || player.f.points.gte(50) }
});

addLayer("s", {
    name: "sky", symbol: "S", position: 0,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#87CEEB", requires: new Decimal(1e12),
    resource: "천공의 정수", baseResource: "포인트",
    baseAmount() {return player.points},
    type: "normal", exponent: 0.2, row: 2,
    layerShown() { return player.n.unlocked || player.n.points.gte(5) }
});
