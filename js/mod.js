let modInfo = {
	name: "The C Tree",
	author: "whitejiyul",
	pointsName: "Cpints",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1000,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
    // 1. 처음에는 생산량 0 (업그레이드 11이 없을 때)
    if (!hasUpgrade('m', 11)) return new Decimal(0);

    // 2. 기본 생산량 시작 (+1)
    let gain = new Decimal(1);

    // 3. [프레스티지 부스트 고침] 보유한 P 포인트만큼 배수 적용
    if (player.p.unlocked) {
        // 프레스티지 포인트 보유량에 따른 부스트 (예: 1포인트면 약 1.4배, 100포인트면 11배)
        gain = gain.times(player.p.points.add(1).pow(0.5));
    }

    // 4. 업그레이드 부스트 적용
    if (hasUpgrade('m', 13)) gain = gain.times(2);
    if (hasUpgrade('m', 14)) gain = gain.times(upgradeEffect('m', 14));

    return gain;
}


// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
