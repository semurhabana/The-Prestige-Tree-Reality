addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return newPlayerStartData()},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = N(1)
        if (hasUpgrade("p", 22)) mult=mult.times(1.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return N(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
  doReset(layer){
    let keep=[]
    if (player.j.best.gte(3) && tmp[layer].row==1 && layer=="j") keep.push("upgrades")
    if (tmp[layer].row >= 1) layerDataReset("p", keep)
  },
  upgrades: {
    11: U("p11", 1),
    12: U("p12", 1),
    13: U("p13", 3),
    21: U("p21", 1),
    22: U("p22", 1),
    23: U("p23", 3),
  }
})

addLayer("j", {
    name: "johns", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "J", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return newPlayerStartData()},
    color: "#5BDC32",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "johns", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    base: 2.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = N(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return N(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.p.unlocked},
    milestones: {
      0: Milestone("3 Johns", function(){ return player.j.best.gte(3) }, "Keep Prestige Upgrades on this reset.")
    },
    effect() {
      return Decimal.pow(2, player.j.points)
    },
    effectDescription(x) {
      return "which multiplies points by "+format(x)+"x."
    },
    branches: ["p"]
})