// ==========================================================
// 1. PRESTIGE LAYER (피) - 기초 레이어
// ==========================================================
addLayer("p", {
    name: "prestige", 
    symbol: "P", 
    position: 0, 
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
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
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        if (hasUpgrade('c', 11)) mult = mult.times(upgradeEffect('c', 11))
        return mult
    },
    gainExp() { return new Decimal(1) },
    row: 0,
    upgrades: {
        11: {
            title: "기초 세포",
            description: "포인트 생산량을 2배로 늘립니다.",
            cost: new Decimal(1),
        },
        12: {
            title: "까마귀의 속삭임",
            description: "까마귀(C) 레이어를 해금합니다.",
            cost: new Decimal(5),
        },
        13: {
            title: "자가 증식",
            description: "포인트에 따라 프레스티지 포인트 획득량이 늘어납니다.",
            cost: new Decimal(20),
            effect() { return player.points.add(1).log10().add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "깃털 준비",
            description: "깃털(F) 레이어 해금을 준비합니다. (포인트 생산 3배)",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade('p', 13) }
        },
    },
    layerShown(){return true}
})

// ==========================================================
// 2. CROW LAYER (까마귀) - 성장의 상징
// ==========================================================
addLayer("c", {
    name: "crow", 
    symbol: "C", 
    position: 1, 
    startData() { return {
        unlocked: false, 
		points: new Decimal(0),
    }},
    color: "#333333", 
    requires: new Decimal(10), 
    resource: "까마귀", 
    baseResource: "프레스티지 포인트", 
    baseAmount() {return player.p.points}, 
    type: "static", 
    base: 1.5,
    exponent: 1.1, 
    row: 0, 
    layerShown(){return hasUpgrade('p', 12) || player.c.unlocked},
    upgrades: {
        11: {
            title: "까마귀 군단",
            description: "까마귀 수에 따라 프레스티지 포인트 획득량이 증가합니다.",
            cost: new Decimal(2),
            effect() { return player.c.points.add(1).pow(0.75) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12: {
            title: "검은 날개",
            description: "포인트 생산량이 5배 증가합니다.",
            cost: new Decimal(5),
        },
    },
    milestones: {
        0: {
            requirementDescription: "까마귀 10마리",
            effectDescription: "포인트를 초당 프레스티지 포인트의 10%만큼 자동 획득합니다.",
            done() { return player.c.points.gte(10) }
        }
    }
})

// ==========================================================
// 3. FEATHER LAYER (깃털) - 가벼운 도약
// ==========================================================
addLayer("f", {
    name: "feather",
    symbol: "F",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(1000),
    resource: "깃털",
    baseResource: "포인트",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.4,
    row: 1, // 두 번째 줄로 이동
    layerShown() { return hasUpgrade('p', 14) || player.f.unlocked },
    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade('f', 12)) mult = mult.times(upgradeEffect('f', 12))
        return mult
    },
    upgrades: {
        11: {
            title: "공기 저항",
            description: "깃털이 포인트 생산량을 크게 부스팅합니다.",
            cost: new Decimal(10),
            effect() { return player.f.points.add(1).pow(0.8) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12: {
            title: "가벼운 가속",
            description: "까마귀 수에 비례하여 깃털 획득량이 늘어납니다.",
            cost: new Decimal(50),
            effect() { return player.c.points.add(1).log10().add(1).pow(2) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    }
})

// ==========================================================
// 4. NEST LAYER (둥지) - 자원의 안식처
// ==========================================================
addLayer("n", {
    name: "nest",
    symbol: "N",
    position: 1,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#8B4513",
    requires: new Decimal(100),
    resource: "둥지",
    baseResource: "깃털",
    baseAmount() {return player.f.points},
    type: "static",
    base: 2,
    exponent: 1.2,
    row: 1,
    layerShown() { return player.f.points.gte(50) || player.n.unlocked },
    buyables: {
        11: {
            title: "알 부화",
            cost(x) { return new Decimal(1).times(x.add(1)) },
            display() { return "포인트 생산량을 강화합니다. \n개수: " + getBuyableAmount(this.layer, this.id) + "\n가격: " + format(this.cost()) + " 둥지" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)) }
        },
    }
})

// ==========================================================
// 5. SKY LAYER (하늘) - 최종장
// ==========================================================
addLayer("s", {
    name: "sky",
    symbol: "S",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#87CEEB",
    requires: new Decimal(1e12), // 1조 포인트 필요
    resource: "천공의 정수",
    baseResource: "포인트",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.2,
    row: 2, // 세 번째 줄
    layerShown() { return player.n.points.gte(5) || player.s.unlocked },
    challenges: {
        11: {
            name: "중력 가속",
            challengeDescription: "포인트 생산량이 ^0.5로 고정됩니다.",
            goalDescription: "1e20 포인트 도달",
            rewardDescription: "모든 레이어의 자원 획득량이 2배가 됩니다.",
            canComplete() { return player.points.gte(1e20) },
        }
    }
})

