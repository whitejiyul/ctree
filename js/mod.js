let modInfo = {
	name: "cTree", // 프로젝트 이름 반영
	author: "Whitejiyul", // 제작자 이름
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(10), 
	offlineLimit: 10000,  
}

// 버전 정보 설정
let VERSION = {
	num: "0.1",
	name: "The Beginning of C",
}

// 변경 사항 (HTML 태그 사용 가능)
let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- Project 'cTree' initialized.<br>
		- Basic point generation added.`

let winText = `축하합니다! cTree의 현재 끝에 도달하셨습니다!`

// 매 틱마다 호출되지 않아야 할 함수 목록
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// 포인트 생성 활성화 여부
function canGenPoints(){
	return true
}

// 초당 포인트 생산량 계산
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
    
    // 이후 layers.js에서 정의할 업그레이드 효과를 여기에 추가하게 됩니다.
    // 예: if (hasUpgrade('c', 11)) gain = gain.times(upgradeEffect('c', 11))
    
	return gain
}

// 세이브 데이터에 추가할 변수들
function addedPlayerData() { return {
    // 예: customValue: new Decimal(0),
}}

// 상단 UI에 표시할 추가 정보
var displayThings = [
    "Current Endgoal: e2.8e8 points"
]

// 게임 클리어 조건 (테트레이션 기반 성장을 고려해 높게 설정됨)
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}

// --- 배경 및 시스템 설정 ---

var backgroundStyle = {
    // 배경 스타일을 객체 형태로 지정 가능
}

function maxTickLength() {
	return(3600) 
}

function fixOldSave(oldVersion){
    // 버전 업데이트 시 세이브 파일 호환성 수정용
}
