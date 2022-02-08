class App {
    constructor(defaultLayer, defaultTool) {
        this.currentLayer = defaultLayer;
        this.currentTool = defaultTool;
        this.snapToBlocks = true;
        this.previousTool = defaultTool;
        this.lastBlockColor = MODI.BLOCCO.TIPO[defaultTool].STROKE_COLOR;
        this.mouseEffect = true;        // Mouse hover effect on blocks
    }

    setTool(newTool) {
        this.previousTool = this.currentTool;
        document.removeEventListener("wheel", MODI.DISEGNO.TIPO.NUMERI.wheel);
        for (let modo in MODI) {
            for (let tipo in MODI[modo]) {
                for (let i = 0; i < Object.keys(MODI[modo][tipo]).length; i++) {
                    if (Object.keys(MODI[modo][tipo])[i] == newTool || Object.values(MODI[modo][tipo])[i].SHORTCUT == newTool) {
                        this.currentLayer = modo;
                        this.currentTool = Object.keys(MODI[modo][tipo])[i];
                        break;
                    }
                }
            }
        }
        if (this.currentLayer == "BLOCCO") {
            if (MODI.BLOCCO.TIPO[app.currentTool].hasOwnProperty('FILL_COLOR')) {
                if (MODI.BLOCCO.TIPO[app.currentTool].FILL_COLOR.every((val, index) => val === MODI.BLOCCO.TIPO.VUOTO.FILL_COLOR[index])) {
                    this.lastBlockColor = MODI.BLOCCO.TIPO.PROGETTATO.STROKE_COLOR;
                } else {
                    this.lastBlockColor = MODI.BLOCCO.TIPO[app.currentTool].FILL_COLOR;
                }
            }
        }
        MODI.DISEGNO.TIPO.NUMERI.numeroTimbro = 1;
        MODI.DISEGNO.TIPO.TESTO.processing = false;
        MODI.DISEGNO.TIPO.FRECCIA.processing = false;
        MODI.DISEGNO.TIPO.QUOTA.processing = false;
    }

    clearLayer(layer) {
        if (layer == "blocchi") {
            for (let b of blocchi) {
                b.status = "VUOTO";
                b.draw.clear();
            }
        } else if (layer == "disegno") {
            disegno.erase();
            disegno.rect(0, 0, width, height);
            disegno.noErase();
        }
    }

    keyPressed() {
        if (MODI.DISEGNO.TIPO.TESTO.processing == true) {
            MODI.DISEGNO.TIPO.TESTO.newKey();
            return;
        } else if (typeof MODI.BLOCCO.TIPO[app.currentTool] != "undefined" && MODI.BLOCCO.TIPO[app.currentTool].hasOwnProperty('TIPO') && MODI.BLOCCO.TIPO[app.currentTool].TIPO == 'TIMBRO') {
            if (keyCode == 37) {
                MODI.BLOCCO.TIPO[app.currentTool].DIRECTION -= 90;
                return;
            } else if (keyCode == 39) {
                MODI.BLOCCO.TIPO[app.currentTool].DIRECTION += 90;
                return;
            }
        }
        for (let modo in MODI) {
            for (let tipo in MODI[modo]) {
                for (let i = 0; i < Object.keys(MODI[modo][tipo]).length; i++) {
                    if (Object.values(MODI[modo][tipo])[i].SHORTCUT == keyCode) {
                        this.setTool(keyCode);
                        return;
                    }
                }
            }
        }
        for (let tipo in AZIONI) {
            for (let azione in AZIONI[tipo]) {
                if (AZIONI[tipo][azione].SHORTCUT == keyCode) {
                    Object.values(AZIONI[tipo][azione])[1]();
                    return;
                }
            }
        }
    }
}


class Blocco {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.status = "VUOTO";
        this.draw = createGraphics(scala, scala);
        this.drawRotation = 0;
        this.drawTint = app.lastBlockColor;
    }

    show() {
        strokeWeight(2);
        fill(MODI.BLOCCO.TIPO[this.status].FILL_COLOR[0], MODI.BLOCCO.TIPO[this.status].FILL_COLOR[1], MODI.BLOCCO.TIPO[this.status].FILL_COLOR[2]);
        stroke(MODI.BLOCCO.TIPO[this.status].STROKE_COLOR[0], MODI.BLOCCO.TIPO[this.status].STROKE_COLOR[1], MODI.BLOCCO.TIPO[this.status].STROKE_COLOR[2]);
        rect(this.x, this.y, scala - 2, scala - 2);
        push();
        tint(this.drawTint);
        image(this.draw, this.x + scala / 2, this.y + scala / 2);
        pop();
    }

    click() {
        if (mouseX >= this.x && mouseX < this.x + scala && mouseY >= this.y && mouseY < this.y + scala) {
            if (app.currentTool == 'AGENT') {
                agent.x = this.x;
                agent.y = this.y;
            } else if (["PORTA", "LASTRA", "PIANTA", "SEMI"].includes(app.currentTool)) {
                this.drawTint = app.lastBlockColor;
                this.draw.clear();
                this.draw.imageMode(CENTER);
                this.draw.angleMode(DEGREES);
                this.draw.push();
                this.draw.translate(scala / 2 - 1, scala / 2 - 1);
                this.draw.rotate(MODI.BLOCCO.TIPO[app.currentTool].DIRECTION);
                this.draw.image(IMAGES[app.currentTool], 0, 0, scala - 4, scala - 4);
                this.draw.pop();
            } else {
                this.status = app.currentTool;
                this.draw.clear();
            }
        }
    }

    mouseEffect(isStamp) {
        if (app.mouseEffect && mouseX >= this.x && mouseX < this.x + scala && mouseY >= this.y && mouseY < this.y + scala) {
            if (isStamp) {
                mouseLayer.tint(app.lastBlockColor[0], app.lastBlockColor[1], app.lastBlockColor[2], 127);
                mouseLayer.push();
                mouseLayer.translate(this.x + scala / 2 - 1, this.y + scala / 2 - 1);
                mouseLayer.imageMode(CENTER);
                mouseLayer.angleMode(DEGREES);
                mouseLayer.rotate(MODI.BLOCCO.TIPO[app.currentTool].DIRECTION);
                mouseLayer.angleMode(RADIANS);
                mouseLayer.image(IMAGES[app.currentTool], 0, 0, scala - 4, scala - 4);
                mouseLayer.pop();
            }
            mouseLayer.noStroke();
            mouseLayer.fill(255, 25);
            mouseLayer.rect(this.x, this.y, scala - 2, scala - 2);
        }
    }
}


class Agent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = 0;
    }

    show() {
        imageMode(CENTER);
        angleMode(DEGREES);
        push();
        translate(this.x + scala / 2, this.y + scala / 2);
        rotate(this.direction);
        image(agentImg, 0, 0, scala - 4, scala - 4);
        pop();
    }
}