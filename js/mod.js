let modInfo = {
	name: "The Prestige Tree Reality",
	author: "tptreality",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: N(10), // Used for hard resets and new players
	offlineLimit: 82828282,  // In hours
  endgame: "3 Johns"
}

// Set your version in num and name
let VERSION = {
	num: "0.2.1",
	name: "John Cena",
}

let changelog = `<h1>Changelog:</h1><br>
	${ChangeLogAmount("v0.1", ["Added first 3 Prestige Upgrades", "Endgame: 10 Prestige Points"])}
  ${ChangeLogAmount("v0.2", ["Added John Layer", "More Prestige Upgrades", "Endgame: 3 Johns"])}
  ${ChangeLogAmount("v0.2.1", ["Bug Fixes"])}
  `
function ChangeLogAmount(version="v0.0", data=["Added things.", "Added stuff."]) {
  let data2=""
  for (let i=0; i<data.length;i++) {
    data2=data2+"- "+data[i]+"<br>"
  }
  return `
    <h3>${version}</h3><br>
      ${data2}<br>
  `
}

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return N(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade("p", 11)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = N(1)
  if (hasUpgrade("p", 12)) gain=gain.times(UpgradeEffect("p", 12))
  if (hasUpgrade("p", 13)) gain=gain.times(3)
  if (player.j.unlocked) gain=gain.times(tmp.j.effect)
  if (hasUpgrade("p", 21)) gain=gain.pow(1.15)
  if (hasUpgrade("p", 23)) gain=gain.times(UpgradeEffect("p", 23))
	return gain
}

function UpgradeEffect(layer, id){
  return tmp[layer].upgrades[id].effect
}

function Milestone(name, req, desc, toggles){
  let data = {
    requirementDescription: name,
    effectDescription: desc,
    done: req,
  }
  if (toggles) data.toggles = toggles
  return data
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

function newPlayerStartData(layerdata={}, addTotal=false, runCtion=function(){}){
  let data=layerdata
  data.unlocked = false
  data.points = N(0)
  data.best = N(0)
  if (addTotal) data.total = N(0)
  data.upgrades = []
  runCtion()
  return data
}

function U(id, cost=N("e1.79e308"), otherData={}){
  let UpgradeIdentifier = {
    p11: {
      title: "Generation",
      description: "Generate One Points per Second",
      unlocked(){ return player.p.unlocked }
    },
    p12: {
      title: "Point Upgrade",
      description: "Multiply Points by Prestige Points",
      unlocked(){ return player.p.upgrades.includes(11) },
      effect(){ return player.p.points.plus(1).sqrt() },
      effectDisplay(){ return "Currently: " + format(this.effect()) + "x" }
    },
    p13: {
      title: "Finally Something Different",
      description: "Multiply Points by 3",
      unlocked(){ return player.p.upgrades.includes(12) },
    },
    p21: {
      title: "Super Multiplier",
      description: "Exponentiate Points by 1.15",
      unlocked(){ return player.j.unlocked && player.p.upgrades.includes(11) },
    },
    p22: {
      title: "Super Prestige",
      description: "Multiply Prestige Points by 1.5",
      unlocked(){ return player.j.unlocked && player.p.upgrades.includes(12) },
    },
    p23: {
      title: "Eggdog",
      description: "Multiply Points by Points",
      unlocked(){ return player.j.unlocked && player.p.upgrades.includes(13) },
      effect(){ return player.points.plus(1).cbrt() },
      effectDisplay(){ return "Currently: " + format(this.effect()) + "x" }
    }
  }
  let Upgrade = otherData
  Upgrade.title = UpgradeIdentifier[id].title
  Upgrade.description = UpgradeIdentifier[id].description
  Upgrade.unlocked = UpgradeIdentifier[id].unlocked
  if (UpgradeIdentifier[id].effect) Upgrade.effect = UpgradeIdentifier[id].effect
  if (UpgradeIdentifier[id].effectDisplay) Upgrade.effectDisplay = UpgradeIdentifier[id].effectDisplay
  Upgrade.cost = N(cost)
  return Upgrade
}

function N(le) {return new Decimal(le)}

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