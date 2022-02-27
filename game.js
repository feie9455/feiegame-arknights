"use strict"
const main = document.querySelector("#main")
let rolesList = []
window.onload = () => {
    if (window.innerHeight / window.innerWidth >= 0.75) {
        main.style.width = "100vw"
        main.style.height = ""

    } else {
        main.style.width = ""
        main.style.height = "100vh"
    }
}
window.onresize = window.onload

class roles {
    constructor(posX, posY, face, faction) {
        this.name = `role${rolesList.length}`
        this.posX = posX
        this.posY = posY
        this.turn = 0
        this.face = face
        this.zindex = rolesList.length
        this.mpAdd = 0.2
        this.hpAdd = 0
        this.faction = faction
        rolesList.unshift(this)
    }
    nextTurn() {
        this.mp += this.mpAdd
        this.hp += this.hpAdd
        this.turn++
        if (this.turn >= this.attspend) {
            console.log(`${this.name} attacked`);
            for (let index = 0; index < rolesList.length; index++) {
                let isSussess = false
                const element = rolesList[index];
                if (this.faction == element.faction) { continue }
                switch (this.face) {
                    case "right":
                        if (element.posX - this.posX <= this.sightX && element.posX - this.posX >= -50 && Math.abs(element.posY - this.posY <= this.sightY)) {
                            this.attack(element)
                            isSussess = true
                        }
                        break
                    case "left":
                        if (this.posX - element.posX <= this.sightX && this.posX - element.posX >= -50 && Math.abs(element.posY - this.posY <= this.sightY)) {
                            this.attack(element)
                            isSussess = true
                        }
                        break
                    case "upon":
                        if (element.posY - this.posY <= this.sightX && element.posY - this.posY >= -50 && Math.abs(element.posX - this.posX <= this.sightY)) {
                            this.attack(element)
                            isSussess = true
                        }
                        break
                    case "bottom":
                        if (this.posY - element.posY <= this.sightX && this.posY - element.posY >= -50 && Math.abs(element.posX - this.posX <= this.sightY)) {
                            this.attack(element)
                            isSussess = true
                        }
                        break
                }
                if (isSussess) {
                    this.turn = 0
                    break
                }
            }
        }
    }
    attack(obj) {
        let damage
        if (this.att > obj.def + 100) {
            damage = this.att - obj.def
        } else {
            damage = getDamage(this.att, obj.def)
        }
        console.log(`${this.name} attacked ${obj.name}, case ${damage} damage`);
        obj.hp -= damage
    }

}
class sniper extends roles {
    constructor(posX, posY, face, faction) {
        super(posX, posY, face, faction)
        this.att = 200
        this.def = 50
        this.hpm = 1000
        this.hp = 1000
        this.mp = 0
        this.attspend = 2
        this.sightX = 350
        this.sightY = 150
    }
}

function nextTurn() {
    rolesList.forEach(element => {
        element.nextTurn()
    });
}
function getDamage(att, def) {
    let n = 10 ** (1 / 50)
    let damage = Math.ceil(n ** (att - def))
    if (damage >= 100) {
        return 100
    } else {
        return damage
    }
}
