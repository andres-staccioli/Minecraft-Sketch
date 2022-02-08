// Minecraft Sketch - Version 0.4 (03-Dec-2021) by Andrés Staccioli
// Last Update app.js: 03-Dec-2021

class App {
    constructor(defaultLayer, defaultTool) {
        this.currentLayer = defaultLayer;
        this.currentTool = defaultTool;
        this.snapToBlocks = true;
        this.previousTool = defaultTool;
        this.lastBlockColor = MODI.BLOCCO.TIPO[defaultTool].STROKE_COLOR;
        this.mouseEffect = true;        // Mouse hover effect on blocks
    }

    newBlocks() {
        blocchi.splice(0, blocchi.length);
        let totalBlocks = 0;

        for (let y = 1; y < height; y += scala) {
            for (let x = 1; x < width; x += scala) {
                totalBlocks++;
            }
        }

        for (let y = 1; y < height; y += scala) {
            for (let x = 1; x < width; x += scala) {
                blocchi.push(new Blocco(x, y));
            }
        }
        agent = new Agent(blocchi[0].x, blocchi[0].y);
        for (let b of blocchi) {
            b.show();
        }
    }

    newCanvas(updateType, newWidth, newHeight) {          // Types: blocchi, fullsizeCanvas, fixedCanvas
        let remainderWidth, remainderHeight;
        let settings = document.getElementById('current_sizes');
        switch (updateType) {
            case "blocchi":
                width = newWidth * scala;
                height = newHeight * scala;
                break;
            case "fullsizeCanvas":
                remainderWidth = (window.innerWidth - 220) % scala;
                remainderHeight = (window.innerHeight - 160) % scala;
                width = (window.innerWidth - 220) - remainderWidth;
                height = (window.innerHeight - 160) - remainderHeight;
                break;
            case "fixedCanvas":
                remainderWidth = newWidth % scala;
                remainderHeight = newHeight % scala;
                width = newWidth - remainderWidth;
                height = newHeight - remainderHeight;
                break;
        }

        if (width < minWidth) {
            app.newCanvas("fixedCanvas", width + scala, height);
            return;
        } else if (height < minHeight) {
            app.newCanvas("fixedCanvas", width, height + scala);
            return;
        }

        settings.innerText = "Scala: " + scala + " — Blocchi: " + (width / scala) + " x " + (height / scala) + " — Canvas: " + width + " x " + height;
        cvs = createCanvas(width, height);
        cvs.parent('canvas');
        pixelDensity(1);
        blocksLayer = createGraphics(width, height);
        disegno = createGraphics(width, height);
        mouseLayer = createGraphics(width, height);
        mouseLayer.noStroke();
        disegno.strokeCap(ROUND);
        disegno.strokeJoin(ROUND);
        mouseLayer.strokeCap(ROUND);
        mouseLayer.strokeJoin(ROUND);
        app.newBlocks();
    }

    newScale(inputScale, isFixed) {
        if (inputScale == scala) {
            return;
        }
        if (scaleList.includes(inputScale)) {
            document.getElementById(`scale_${inputScale}`).checked = true;
        }
        const warning = "Cambiare la scala dei blocchi cancellerà lo sketch attuale. Procediamo?";
        // if (scaleList.includes(inputScale)) {
        if (confirm(warning)) {
            if (isFixed) {
                if (inputScale != scala && inputScale >= minScale && inputScale <= maxScale) {
                    scala = inputScale;
                    app.newCanvas("fullsizeCanvas");
                }
            } else {
                scala += inputScale;
                scala = constrain(scala, minScale, maxScale);
                app.newCanvas("fullsizeCanvas");
            }
        }
        // }
    }

    togglePrintMode(status) {
        printMode = status;
        for (let b of blocchi) {
            for (let i = 0; i < 7; i++) {
                b.show();
            }
        }
        for (let b of blocchi) {
            if (b.status != 'VUOTO') {
                b.show();
            }
        }
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
                b.tnt = false;
                b.show();
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

    boom() {
        let tnt = [];

        function randomness1(i) {
            let random_blocks = [
                [i - 2 * (width / scala), i - 2 * (width / scala) - 1, i - 2 * (width / scala) + 1, i + 2 * (width / scala), i + 2 * (width / scala) - 1, i + 2 * (width / scala) + 1, i - 2, i - 2 - width / scala, i - 2 + width / scala, i + 2, i + 2 - width / scala, i + 2 + width / scala],
                [],
            ];
            return random_blocks[0];
        }

        function randomness2(i) {
            let random_blocks = [
                [i - 3 * (width / scala), i - 3 * (width / scala) - 1, i - 3 * (width / scala) + 1, i + 3 * (width / scala), i + 3 * (width / scala) - 1, i + 3 * (width / scala) + 1, i - 3, i - 3 - width / scala, i - 3 + width / scala, i + 3, i + 3 - width / scala, i + 3 + width / scala, i - 2 * (width / scala) - 2, i - 2 * (width / scala) + 2, i + 2 * (width / scala) - 2, i + 2 * (width / scala) + 2],
                [],
            ];
            return random_blocks[0];
        }

        for (let i = 0; i < blocchi.length; i++) {
            if (blocchi[i].tnt) {
                tnt.push(i);
            }
            blocchi[i].tnt = false;
        }

        if (tnt.length > 0) {
            tntSound.amp(0.2);
            tntSound.play();
        }

        for (let t of tnt) {
            let explode1 = [];
            let explode2 = [];

            explode1.push(t);
            explode1.push(t + 1);                   // RIGHT BLOCK
            explode1.push(t - 1);                   // LEFT BLOCK
            explode1.push(t - (width / scala));     // TOP BLOCK
            explode1.push(t + (width / scala));     // BOTTOM BLOCK

            explode1.push(t - (width / scala) - 1);     // TOP-LEFT BLOCK
            explode1.push(t - (width / scala) + 1);     // TOP-RIGHT BLOCK
            explode1.push(t + (width / scala) - 1);     // BOTTOM-LEFT BLOCK
            explode1.push(t + (width / scala) + 1);     // BOTTOM-RIGHT BLOCK

            for (let r of randomness1(t)) {
                explode1.push(r);
            }

            for (let r of randomness2(t)) {
                explode2.push(r);
            }

            for (let e1 of explode1) {
                if (e1 >= 0 && e1 < blocchi.length && dist(blocchi[e1].x, blocchi[e1].y, blocchi[t].x, blocchi[t].y) <= scala * 4) {
                    blocchi[e1].status = 'GRIGIO';
                    blocchi[e1].draw.clear();
                    blocchi[e1].show();
                    disegno.erase();
                    disegno.rect(blocchi[e1].x, blocchi[e1].y, scala, scala);
                    disegno.noErase();
                }
            }

            for (let e2 of explode2) {
                if (e2 >= 0 && e2 < blocchi.length && dist(blocchi[e2].x, blocchi[e2].y, blocchi[t].x, blocchi[t].y) <= scala * 4) {
                    if (blocchi[e2].status != 'GRIGIO') {
                        blocchi[e2].status = 'PIAZZATO';
                    }
                    blocchi[e2].draw.clear();
                    blocchi[e2].show();
                    disegno.erase();
                    disegno.fill(255);
                    disegno.rect(blocchi[e2].x, blocchi[e2].y, scala, scala);
                    disegno.fill(0, 127);
                    disegno.rect(blocchi[e2].x - scala, blocchi[e2].y - scala, scala * 3, scala * 3);
                    disegno.noErase();
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
        this.tnt = false;
    }

    show() {
        blocksLayer.strokeWeight(2);
        blocksLayer.fill(MODI.BLOCCO.TIPO[this.status].FILL_COLOR[0], MODI.BLOCCO.TIPO[this.status].FILL_COLOR[1], MODI.BLOCCO.TIPO[this.status].FILL_COLOR[2]);
        blocksLayer.stroke(MODI.BLOCCO.TIPO[this.status].STROKE_COLOR[0], MODI.BLOCCO.TIPO[this.status].STROKE_COLOR[1], MODI.BLOCCO.TIPO[this.status].STROKE_COLOR[2]);

        if (printMode) {
            if (this.status == 'VUOTO') {
                blocksLayer.fill(255);
                blocksLayer.stroke(255);
                blocksLayer.strokeWeight(0.5);
            } else if (this.status == 'PROGETTATO') {
                blocksLayer.fill(200);
                blocksLayer.stroke(127);
                blocksLayer.strokeWeight(4);
            } else {
                blocksLayer.fill(100);
                blocksLayer.stroke(0);
                blocksLayer.strokeWeight(4);
            }

        }
        blocksLayer.rect(this.x, this.y, scala - 2, scala - 2);
        blocksLayer.push();
        blocksLayer.tint(this.drawTint);
        if (printMode) {
            blocksLayer.tint(127);
        }
        blocksLayer.image(this.draw, this.x, this.y);
        blocksLayer.pop();
    }

    click() {
        if (app.currentTool == 'AGENT') {
            agent.x = this.x;
            agent.y = this.y;
        } else if (["PORTA", "LASTRA", "PIANTA", "SEMI", "TNT"].includes(app.currentTool)) {
            if (app.currentTool == "TNT") {
                this.drawTint = 255;
                this.tnt = true;
            } else {
                this.drawTint = app.lastBlockColor;
                this.tnt = false;
            }
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
            this.tnt = false;
            this.draw.clear();
        }
    }

    mouseEffect(isStamp) {
        if (app.mouseEffect && mouseX >= this.x && mouseX < this.x + scala && mouseY >= this.y && mouseY < this.y + scala) {
            if (isStamp) {
                if (app.currentTool == "TNT") {
                    mouseLayer.tint(255, 127);
                } else {
                    mouseLayer.tint(app.lastBlockColor[0], app.lastBlockColor[1], app.lastBlockColor[2], 127);
                }
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
