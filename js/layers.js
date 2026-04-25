// ==========================================================
// 1. PRESTIGE LAYER (피 / P)
// ==========================================================
addLayer("p", {
    name: "prestige", 
    symbol: "P", 
    position: 0, 
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
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
        if (hasUpgrade('p', 25)) mult = mult.times(2)
        if (hasUpgrade('c', 11)) mult = mult.times(upgradeEffect('c', 11))
        return mult
    },
    gainExp() { return new Decimal(1) },
    row: 0,

    // --- 업그레이드 총 20개 (포인트 강화 10개 + 프레스티지 강화 10개) ---
    upgrades: {
        // [포인트 강화 계열 - 10개]
        11: { title: "기초 세포", description: "포인트 생산량 +1", cost: new Decimal(1) },
        12: { title: "가속화 I", description: "포인트 생산량 2배", cost: new Decimal(5) },
        13: { title: "가속화 II", description: "포인트 생산량 3배", cost: new Decimal(15) },
        14: { title: "까마귀의 속삭임", description: "까마귀(C) 레이어를 해금합니다.", cost: new Decimal(50) },
        15: { title: "수학적 최적화", description: "포인트 생산량이 ^1.1 증가합니다.", cost: new Decimal(200) },
        16: { title: "자기 복제", description: "현재 포인트의 log10만큼 포인트 생산량 증가", cost: new Decimal(1000), 
              effect() { return player.points.add(1).log10().add(1) }, 
              effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" } },
        17: { title: "깃털 준비", description: "깃털(F) 레이어 해금 준비 (포인트 5배)", cost: new Decimal(5000) },
        18: { title: "포인트 대폭발", description: "포인트 생산량 10배", cost: new Decimal(25000) },
        19: { title: "차원 가속", description: "프레스티지 포인트에 비례해 포인트 생산량 증가", cost: new Decimal(1e5),
              effect() { return player.p.points.add(1).pow(0.2) },
              effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" } },
        20: { title: "포인트 마스터", description: "포인트 생산량 100배", cost: new Decimal(1e6) },

        // [프레스티지 강화 계열 - 10개]
        21: { title: "피의 순환", description: "포인트 수치에 따라 프레스티지 포인트 획득량 증가", cost: new Decimal(10),
              effect() { return player.points.add(1).log10().add(1).pow(0.5) } },
        22: { title: "강화된 응축", description: "프레스티지 요구량 10% 감소", cost: new Decimal(100) },
        23: { title: "까마귀 시너지", description: "까마귀 수당 프레스티지 포인트 획득 +20%", cost: new Decimal(500),
              effect() { return player.c.points.times(0.2).add(1) } },
        24: { title: "효율적 리셋", description: "리셋 시 포인트를 10% 보존합니다.", cost: new Decimal(2500) },
        25: { title: "더블 블러드", description: "프레스티지 포인트 획득량 2배", cost: new Decimal(1e4) },
        26: { title: "둥지 보너스", description: "둥지(N) 레이어의 효과가 프레스티지에 영향을 줍니다.", cost: new Decimal(5e4) },
        27: { title: "프레스티지 폭포", description: "초당 프레스티지 포인트의 1%를 자동으로 획득합니다.", cost: new Decimal(2e5) },
        28: { title: "심연의 힘", description: "프레스티지 포인트 획득 지수 +0.05", cost: new Decimal(1e6) },
        29: { title: "하늘의 부름", description: "하늘(S) 레이어 요구치를 낮춥니다.", cost: new Decimal(1e7) },
        30: { title: "프레스티지 신", description: "프레스티지 포인트 획득량 10배", cost: new Decimal(1e8) },
    },
    layerShown(){return true}
})

// ==========================================================
// 2. CROW LAYER (까마귀 / C)
// ==========================================================
addLayer("c", {
    name: "crow", symbol: "C", position: 1, 
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#333333", requires: new Decimal(10), 
    resource: "까마귀", baseResource: "프레스티지 포인트", 
    baseAmount() {return player.p.points}, 
    type: "static", base: 1.5, exponent: 1.1, row: 0, 
    layerShown(){return hasUpgrade('p', 14) || player.c.unlocked},
    upgrades: {
        11: { title: "까마귀 군단", description: "프레스티지 포인트 획득량 보너스", cost: new Decimal(2),
              effect() { return player.c.points.add(1).pow(0.5) } },
    }
})

// ==========================================================
// 3. FEATHER LAYER (깃털 / F)
// ==========================================================
addLayer("f", {
    name: "feather", symbol: "F", position: 0,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#FFFFFF", requires: new Decimal(1000),
    resource: "깃털", baseResource: "포인트",
    baseAmount() {return player.points},
    type: "normal", exponent: 0.4, row: 1,
    layerShown() { return hasUpgrade('p', 17) || player.f.unlocked }
})

// ==========================================================
// 4. NEST LAYER (둥지 / N)
// ==========================================================
addLayer("n", {
    name: "nest", symbol: "N", position: 1,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#8B4513", requires: new Decimal(100),
    resource: "둥지", baseResource: "깃털",
    baseAmount() {return player.f.points},
    type: "static", row: 1,
    layerShown() { return player.f.points.gte(50) || player.n.unlocked }
})

// ==========================================================
// 5. SKY LAYER (하늘 / S)
// ==========================================================
addLayer("s", {
    name: "sky", symbol: "S", position: 0,
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#87CEEB", requires: new Decimal(1e12),
    resource: "천공의 정수", baseResource: "포인트",
    baseAmount() {return player.points},
    type: "normal", exponent: 0.2, row: 2,
    layerShown() { return player.n.points.gte(5) || player.s.unlocked }
})
