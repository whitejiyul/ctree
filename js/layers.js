addLayer("p", {
    name: "prestige", 
    symbol: "P", 
    position: 0, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0), // 최고 기록 추적
        total: new Decimal(0), // 누적 획득량 추적
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
        // 업그레이드 13번: 포인트에 비례해 프레스티지 포인트 획득량 증가
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        return mult
    },
    gainExp() { 
        return new Decimal(1)
    },
    row: 0, 

    // --- 업그레이드 (Upgrades) ---
    upgrades: {
        11: {
            title: "시작의 기초",
            description: "초당 포인트 생산량을 2배로 늘립니다.",
            cost: new Decimal(1),
        },
        12: {
            title: "자기 강화",
            description: "프레스티지 포인트가 포인트 생산량을 증가시킵니다.",
            cost: new Decimal(5),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "역방향 보너스",
            description: "포인트가 프레스티지 포인트 획득량을 증가시킵니다.",
            cost: new Decimal(20),
            effect() {
                return player.points.add(1).log10().add(1).pow(0.75)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },

    // --- 이정표 (Milestones) ---
    milestones: {
        0: {
            requirementDescription: "누적 100 프레스티지 포인트",
            effectDescription: "포인트가 프레스티지 포인트 획득 시 초기화되지 않습니다 (자동 획득 기능의 기초).",
            done() { return player[this.layer].total.gte(100) }
        }
    },

    // --- 도전 (Challenges) ---
    challenges: {
        11: {
            name: "압박감",
            challengeDescription: "포인트 생산량이 ^0.5로 감소합니다.",
            goalDescription: "1,000 포인트 도달",
            canComplete() { return player.points.gte(1000) },
            rewardDescription: "프레스티지 포인트 지수가 1.1배 증가합니다.",
            unlocked() { return hasUpgrade('p', 13) },
        },
    },

    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
