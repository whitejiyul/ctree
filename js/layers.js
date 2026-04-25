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
    resource: "prestige points", 
    baseResource: "points", 
    baseAmount() {return player.points}, 
    type: "normal", 
    exponent: 0.5, 

    // --- 밸런스 조정된 획득 공식 ---
    gainMult() { 
        let mult = new Decimal(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        if (hasUpgrade('p', 22)) mult = mult.times(upgradeEffect('p', 22))
        if (hasMilestone('p', 1)) mult = mult.times(2) // 마일스톤 보너스
        return mult
    },
    gainExp() { 
        let exp = new Decimal(1)
        if (hasChallenge('p', 11)) exp = exp.times(1.1) // 도전 완료 보상
        return exp
    },

    row: 0,

    // --- 콘텐츠 확장: 업그레이드 ---
    upgrades: {
        11: {
            title: "기초 동력",
            description: "포인트 생산량을 2배로 늘립니다.",
            cost: new Decimal(1),
        },
        12: {
            title: "자기 강화 루프",
            description: "프레스티지 포인트가 포인트 생산량을 부스팅합니다.",
            cost: new Decimal(5),
            effect() {
                return player[this.layer].points.add(1).pow(0.5).softcap(100, 0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "지식 확장",
            description: "포인트가 프레스티지 포인트 획득량을 늘립니다.",
            cost: new Decimal(25),
            effect() {
                return player.points.add(1).log10().add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: {
            title: "시간 가속",
            description: "플레이 시간에 비례하여 포인트 생산량이 증가합니다.",
            cost: new Decimal(100),
            effect() {
                return Decimal.pow(1.1, Math.log10(player[this.layer].resetTime + 1))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return hasUpgrade('p', 13) }
        },
        22: {
            title: "시너지 효과",
            description: "구매한 업그레이드 개수당 프레스티지 포인트 획득량이 10% 증가합니다.",
            cost: new Decimal(500),
            effect() {
                return new Decimal(1.1).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return hasMilestone('p', 0) }
        }
    },

    // --- 콘텐츠 확장: 이정표 (진행도에 따른 편의성) ---
    milestones: {
        0: {
            requirementDescription: "누적 1,000 프레스티지 포인트",
            effectDescription: "포인트 생성 업그레이드(11번)를 자동으로 구매하고, 22번 업그레이드를 해금합니다.",
            done() { return player[this.layer].total.gte(1000) }
        },
        1: {
            requirementDescription: "누적 10,000 프레스티지 포인트",
            effectDescription: "프레스티지 포인트 획득량이 영구적으로 2배 증가하고 초기화 시 포인트를 유지합니다.",
            done() { return player[this.layer].total.gte(10000) }
        }
    },

    // --- 콘텐츠 확장: 도전 (전략적 요소) ---
    challenges: {
        11: {
            name: "극한의 절약",
            challengeDescription: "모든 포인트 생산량이 ^0.5로 감소합니다.",
            goalDescription: "5,000 포인트 도달",
            rewardDescription: "프레스티지 포인트 획득 지수(Exponent)가 1.1배 증가합니다.",
            canComplete() { return player.points.gte(5000) },
            unlocked() { return hasUpgrade('p', 22) }
        }
    },

    layerShown(){return true}
})
