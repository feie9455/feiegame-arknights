"use strict"
const main = document.querySelector("#main")
const damageRate = 1.11
let gameSpeed = 10
let rolesList = []
let effectlines = []
const ctx = document.getElementById("main").getContext("2d")
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

class eline {
    constructor(posX, posY, eposX, eposY) {
        this.posX = posX
        this.posY = posY
        this.eposX = eposX
        this.eposY = eposY
        this.time = gameSpeed
        effectlines.push(this)
    }
    nextTurn() {
        ctx.strokeStyle="#FFFF00"
        ctx.lineWidth=15
        ctx.beginPath()
        ctx.moveTo(this.posX, this.posY);
        ctx.lineTo(this.eposX, this.eposY);
        ctx.closePath();
        ctx.stroke();
        this.time--
        if (this.time == 0) {
            delete effectlines[effectlines.indexOf(this)]
        }
    }
}

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
        let isAttacking = false
        for (let index = 0; index < rolesList.length; index++) {
            const element = rolesList[index];
            if (!element) { continue }
            let isSussess = false
            if (this.faction == element.faction) { continue }
            switch (this.face) {
                case "right":
                    if (element.posX - this.posX <= this.sightX && element.posX - this.posX >= -50 && Math.abs(element.posY - this.posY) <= this.sightY) {
                        isAttacking = true
                        if (this.turn >= this.attspend) {
                            this.attack(element)
                            isSussess = true
                        }
                    }
                    break
                case "left":
                    if (this.posX - element.posX <= this.sightX && this.posX - element.posX >= -50 && Math.abs(element.posY - this.posY) <= this.sightY) {
                        isAttacking = true
                        if (this.turn >= this.attspend) {
                            this.attack(element)
                            isSussess = true
                        }
                    }
                    break
                case "bottom":
                    if (element.posY - this.posY <= this.sightX && element.posY - this.posY >= -50 && Math.abs(element.posX - this.posX) <= this.sightY) {
                        isAttacking = true
                        if (this.turn >= this.attspend) {
                            this.attack(element)
                            isSussess = true
                        }
                    }
                    break
                case "upon":
                    if (this.posY - element.posY <= this.sightX && this.posY - element.posY >= -50 && Math.abs(element.posX - this.posX) <= this.sightY) {
                        isAttacking = true
                        if (this.turn >= this.attspend) {
                            this.attack(element)
                            isSussess = true
                        }
                    }
                    break
            }
            if (isSussess) {
                this.turn = 0
                break
            }
        } if (!isAttacking) {
            this.move()
        }


    }
    attack(obj) {
        let damage
        let realdef = obj.pdef * (1 - ((obj.hpm - obj.hp) / obj.hpm) * (1 / obj.determination))
        let realatt = this.att * (1 - ((this.hpm - this.hp) / this.hpm) * (1 / this.determination))
        let realdatt = obj.att * (1 - ((obj.hpm - obj.hp) / obj.hpm) * (1 / obj.determination))
        let realmdef = obj.mdef * (1 - ((obj.hpm - obj.hp) / obj.hpm) * (1 / obj.determination))
        switch (this.attype) {
            case "physic":
                damage = damageRate ** (realatt - realdef)
                break
            case "real":
                damage = damageRate ** (realatt - Math.min(realdatt, realdef))
                break
            case "magic":
                damage = damageRate ** (realatt - Math.min(realdatt, realdef) + realmdef)
                break
        }
        damage = Math.ceil(damage)
        console.log(`${this.name} attacked ${obj.name}, case ${damage} damage by ${this.attype}`);
        ctx.fillStyle = "#FFFF00";

        new eline(this.posX, this.posY, obj.posX, obj.posY)
        obj.hp -= damage


    }
    move() {
        switch (this.face) {
            case "right":
                this.posX += this.movespeed
                break
            case "left":
                this.posX -= this.movespeed
                break
            case "upon":
                this.posY -= this.movespeed
                break
            case "bottom":
                this.posY += this.movespeed
                break
        }

    }
}
class sniper extends roles {
    constructor(posX, posY, face, faction) {
        super(posX, posY, face, faction)
        this.att = 100
        this.attype = "physic"
        this.pdef = 45
        this.mdef = 0
        this.hpm = 1000
        this.hp = 1000
        this.mp = 0
        this.attspend = 20
        this.movespeed = 0
        this.sightX = 350
        this.sightY = 150
        this.determination = 10
    }
}

class caster extends roles {
    constructor(posX, posY, face, faction) {
        super(posX, posY, face, faction)
        this.att = 100
        this.attype = "magic"
        this.pdef = 35
        this.mdef = 20
        this.hpm = 1000
        this.hp = 1000
        this.mp = 0
        this.attspend = 30
        this.movespeed = 0
        this.sightX = 350
        this.sightY = 150
        this.determination = 8
    }
}

class tank extends roles {
    constructor(posX, posY, face, faction) {
        super(posX, posY, face, faction)
        this.att = 80
        this.attype = "physic"
        this.pdef = 60
        this.mdef = 8
        this.hpm = 1000
        this.hp = 1000
        this.mp = 0
        this.attspend = 25
        this.movespeed = 0
        this.sightX = 50
        this.sightY = 50
        this.determination = 20
    }
}

class tankmoving extends roles {
    constructor(posX, posY, face, faction) {
        super(posX, posY, face, faction)
        this.att = 80
        this.attype = "physic"
        this.pdef = 60
        this.mdef = 8
        this.hpm = 800
        this.hp = 800
        this.mp = 0
        this.attspend = 25
        this.movespeed = 10
        this.sightX = 50
        this.sightY = 50
        this.determination = 20
    }
}


function nextTurn() {
    rolesList.forEach(element => {
        if (element) {
            if (element.hp < 0) {
                delete rolesList[rolesList.indexOf(element)]
            } else {
                element.nextTurn()
            }
        }
    });
    ctx.clearRect(0, 0, 1600, 1200);

    rolesList.forEach(element => {
        if (element) {
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(element.posX - 20, element.posY - 20, 40, 40);
        }
    });
        effectlines.forEach(element => element.nextTurn())

}

function Ticking() {
    nextTurn()
    setTimeout(() => {
        Ticking()
    }, 1 / gameSpeed * 1000);
}