const MODI = {
    BLOCCO: {
        TIPO: {
            VUOTO: {
                FILL_COLOR: [30, 60, 30],       // Verde
                STROKE_COLOR: [20, 40, 20],     // Verde scuro
                SHORTCUT: 81                    // Tasto Q
            },
            PROGETTATO: {
                FILL_COLOR: [30, 60, 30],       // Verde (= vuoto)
                STROKE_COLOR: [200, 180, 32],   // Giallo
                SHORTCUT: 49                    // Tasto 1
            },
            PIAZZATO: {
                FILL_COLOR: [134, 89, 45],      // Marrone chiaro
                STROKE_COLOR: [96, 64, 32],     // Marrone scuro
                SHORTCUT: 50                    // Tasto 2
            },
            BIANCO: {
                FILL_COLOR: [200, 200, 200],
                STROKE_COLOR: [150, 150, 150],
                SHORTCUT: 51                    // Tasto 3
            },
            ROSSO: {
                FILL_COLOR: [150, 0, 0],
                STROKE_COLOR: [100, 0, 0],
                SHORTCUT: 52                    // Tasto 4
            },
            VERDE: {
                FILL_COLOR: [0, 150, 0],
                STROKE_COLOR: [0, 100, 0],
                SHORTCUT: 53                    // Tasto 5
            },
            BLU: {
                FILL_COLOR: [0, 0, 150],
                STROKE_COLOR: [0, 0, 100],
                SHORTCUT: 54                    // Tasto 6
            },
            GRIGIO: {
                FILL_COLOR: [127, 127, 127],
                STROKE_COLOR: [80, 80, 80],
                SHORTCUT: 55                    // Tasto 7
            },
            GIALLO: {
                FILL_COLOR: [180, 180, 0],
                STROKE_COLOR: [150, 150, 0],
                SHORTCUT: 56                    // Tasto 8
            },
            VIOLA: {
                FILL_COLOR: [150, 0, 150],
                STROKE_COLOR: [100, 0, 100],
                SHORTCUT: 57                    // Tasto 9
            },
            ARANCIONE: {
                FILL_COLOR: [180, 80, 0],
                STROKE_COLOR: [140, 60, 0],
                SHORTCUT: 48                    // Tasto 0
            },
            NERO: {
                FILL_COLOR: [10, 10, 10],
                STROKE_COLOR: [50, 50, 50],
                SHORTCUT: 85                    // Tasto U
            },
            PORTA: {
                SHORTCUT: 72,                   // Tasto H
                TIPO: 'TIMBRO',
                FILE: 'images/porta.png',
                DIRECTION: 90
            },
            LASTRA: {
                SHORTCUT: 74,                   // Tasto J
                TIPO: 'TIMBRO',
                FILE: 'images/lastra.png',
                DIRECTION: 0
            },
            PIANTA: {
                SHORTCUT: 75,                   // Tasto K
                TIPO: 'TIMBRO',
                FILE: 'images/pianta.png',
                DIRECTION: 0
            },
            SEMI: {
                SHORTCUT: 76,                   // Tasto L
                TIPO: 'TIMBRO',
                FILE: 'images/semi.png',
                DIRECTION: 0
            },
            AGENT: {
                SHORTCUT: 65                    // Tasto A
            },
            TNT: {
                TIPO: 'TIMBRO',
                FILE: 'images/tnt-top.jpg',
                DIRECTION: 0
            }
        },
        click(tool, isReleased) {
            const columns = width / scala;
            const x = floor(mouseX / scala);
            const y = floor(mouseY / scala);
            let indexBlocco = x + columns * y;
            if (keyIsPressed && keyCode == 16 && lastBlock) {
                if (x == lastBlock.x) {
                    if (y > lastBlock.y) {
                        for (let blockY = lastBlock.y + 1; blockY <= y; blockY += 1) {
                            indexBlocco = x + columns * blockY;
                            blocchi[indexBlocco].click();
                            blocchi[indexBlocco].show();
                        }
                    } else {
                        for (let blockY = lastBlock.y - 1; blockY >= y; blockY -= 1) {
                            indexBlocco = x + columns * blockY;
                            blocchi[indexBlocco].click();
                            blocchi[indexBlocco].show();
                        }
                    }
                } else if (y == lastBlock.y) {
                    if (x > lastBlock.x) {
                        for (let blockX = lastBlock.x + 1; blockX <= x; blockX += 1) {
                            indexBlocco = blockX + columns * y;
                            blocchi[indexBlocco].click();
                            blocchi[indexBlocco].show();
                        }
                    } else {
                        for (let blockX = lastBlock.x - 1; blockX >= x; blockX -= 1) {
                            indexBlocco = blockX + columns * y;
                            blocchi[indexBlocco].click();
                            blocchi[indexBlocco].show();
                        }
                    }
                }
            }
            lastBlock = {
                index: indexBlocco,
                x: floor(blocchi[indexBlocco].x / scala),
                y: floor(blocchi[indexBlocco].y / scala),
                status: blocchi[indexBlocco].status
            }
            blocchi[indexBlocco].click();
            blocchi[indexBlocco].show();
        },
        mouseEffect() {
            mouseLayer.clear();
            if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
                let isStamp;
                if (["PORTA", "LASTRA", "PIANTA", "SEMI", "TNT"].includes(app.currentTool)) {
                    isStamp = true;
                } else {
                    isStamp = false;
                }
                const columns = width / scala;
                const x = floor(mouseX / scala);
                const y = floor(mouseY / scala);
                const indexBlocco = x + columns * y;
                blocchi[indexBlocco].mouseEffect(isStamp);
            }
        }
    },
    DISEGNO: {
        TIPO: {
            MATITA: {
                SHORTCUT: 69,                   // Tasto E
                click() {
                    disegno.stroke(colore_matita.value);
                    disegno.strokeWeight(3);
                    disegno.line(pmouseX, pmouseY, mouseX, mouseY);
                },
                mouseEffect() {
                    mouseLayer.fill(colore_matita.value);
                    mouseLayer.ellipse(mouseX, mouseY, 5);
                    mouseLayer.fill(255, 25);
                }
            },
            GOMMA: {
                SHORTCUT: 82,                   // Tasto R
                click() {
                    disegno.erase();
                    disegno.stroke(255);
                    disegno.strokeWeight(30);
                    disegno.line(pmouseX, pmouseY, mouseX, mouseY);
                    disegno.noErase();
                },
                mouseEffect() {
                    mouseLayer.ellipse(mouseX, mouseY, 30);
                    mouseLayer.fill(255, 25);
                }
            },
            NUMERI: {
                SHORTCUT: 89,                   // Tasto Y
                numeroTimbro: 1,
                click(isReleased) {
                    if (isReleased) {
                        disegno.noStroke();
                        MODI.DISEGNO.text(disegno, textSize, mouseX, mouseY, CENTER, "FF", this.numeroTimbro);
                        this.numeroTimbro++;
                    }
                },
                mouseEffect() {
                    document.addEventListener("wheel", this.wheel);
                    MODI.DISEGNO.text(mouseLayer, textSize, mouseX, mouseY, CENTER, "BB", this.numeroTimbro);
                },
                wheel(eventInfo) {
                    if (eventInfo.deltaY < 0) {
                        MODI.DISEGNO.TIPO.NUMERI.numeroTimbro++;
                    } else if (eventInfo.deltaY > 0) {
                        MODI.DISEGNO.TIPO.NUMERI.numeroTimbro--;
                    }
                }
            },
            FRECCIA: {
                SHORTCUT: 70,                   // Tasto F
                click(isReleased) {
                    if (!this.processing) {
                        if (app.snapToBlocks) {
                            const columns = width / scala;
                            const x = floor(mouseX / scala);
                            const y = floor(mouseY / scala);
                            const indexBlocco = x + columns * y;
                            this.startingPoint = createVector(blocchi[indexBlocco].x + scala / 2, blocchi[indexBlocco].y + scala / 2);
                            this.endingPoint = createVector(blocchi[indexBlocco].x + scala / 2 - this.startingPoint.x, blocchi[indexBlocco].y + scala / 2 - this.startingPoint.y);
                        } else {
                            this.startingPoint = createVector(mouseX, mouseY);
                            this.endingPoint = createVector(mouseX - this.startingPoint.x, mouseY - this.startingPoint.y);
                        }
                        this.processing = true;
                    } else if (isReleased && dist(this.startingPoint.x, this.startingPoint.y, mouseX, mouseY) >= scala / 1.414) {
                        if (app.snapToBlocks) {
                            const columns = width / scala;
                            const x = floor(mouseX / scala);
                            const y = floor(mouseY / scala);
                            const indexBlocco = x + columns * y;
                            this.endingPoint = createVector(blocchi[indexBlocco].x + scala / 2 - this.startingPoint.x, blocchi[indexBlocco].y + scala / 2 - this.startingPoint.y);
                        } else {
                            this.endingPoint = createVector(mouseX - this.startingPoint.x, mouseY - this.startingPoint.y);
                        }
                        this.processing = false;
                        this.drawArrow(disegno, this.startingPoint, this.endingPoint, "FF");
                    }
                },
                mouseEffect() {
                    if (this.processing) {
                        if (keyIsPressed && keyCode == 27) {
                            this.processing = false;
                        } else if (app.snapToBlocks) {
                            MODI.BLOCCO.mouseEffect();
                            const columns = width / scala;
                            const x = floor(mouseX / scala);
                            const y = floor(mouseY / scala);
                            const indexBlocco = x + columns * y;
                            this.endingPoint.x = blocchi[indexBlocco].x + scala / 2 - this.startingPoint.x;
                            this.endingPoint.y = blocchi[indexBlocco].y + scala / 2 - this.startingPoint.y;
                        } else {
                            this.endingPoint.x = mouseX - this.startingPoint.x;
                            this.endingPoint.y = mouseY - this.startingPoint.y;
                        }
                        this.drawArrow(mouseLayer, this.startingPoint, this.endingPoint, "BB");
                    } else {
                        if (app.snapToBlocks) {
                            MODI.BLOCCO.mouseEffect();
                        }
                        mouseLayer.stroke(colore_matita.value + "BB");
                        let rotationAngle = 50;
                        mouseLayer.strokeWeight(3);
                        mouseLayer.noFill();
                        mouseLayer.push();
                        mouseLayer.translate(mouseX, mouseY);
                        mouseLayer.rotate(rotationAngle);
                        let radius = 10;
                        let ax = (radius * -0.866);
                        let ay = (radius * 0.5);
                        let bx = (radius * 0.866);
                        let by = (radius * 0.5);
                        let cx = (radius * 0.0);
                        let cy = (radius * -1.0);
                        mouseLayer.triangle(ax, ay, bx, by, cx, cy);
                        mouseLayer.ellipse((ax + bx + cx) / 3, (ay + by + cy) / 3, 3);
                        mouseLayer.pop();
                        mouseLayer.fill(255, 25);
                    }
                    if (keyIsPressed && keyCode == 18) {
                        app.snapToBlocks = false;
                    } else {
                        app.snapToBlocks = true;
                    }
                },
                drawArrow(layer, startVector, endVector, alpha) {
                    layer.push();
                    layer.stroke(colore_matita.value + alpha);
                    layer.strokeWeight(3);
                    layer.translate(startVector.x, startVector.y);
                    layer.line(0, 0, endVector.x, endVector.y);
                    layer.rotate(radians(endVector.heading()));
                    let arrowSize = constrain(endVector.mag() / 3, 1, 12);
                    layer.translate(endVector.mag() - arrowSize, 0);
                    layer.line(arrowSize, 0, 0, arrowSize / 1.33);
                    layer.line(arrowSize, 0, 0, -arrowSize / 1.33);
                    layer.pop();
                }
            },
            QUOTA: {
                SHORTCUT: 71,                   // Tasto G
                click(isReleased) {
                    if (!this.processing) {
                        if (app.snapToBlocks) {
                            const columns = width / scala;
                            const x = floor(mouseX / scala);
                            const y = floor(mouseY / scala);
                            const indexBlocco = x + columns * y;
                            this.startingPoint = createVector(blocchi[indexBlocco].x + scala / 2, blocchi[indexBlocco].y + scala / 2);
                            this.endingPoint = createVector(blocchi[indexBlocco].x + scala / 2 - this.startingPoint.x, blocchi[indexBlocco].y + scala / 2 - this.startingPoint.y);
                        } else {
                            this.startingPoint = createVector(mouseX, mouseY);
                            this.endingPoint = createVector(mouseX - this.startingPoint.x, mouseY - this.startingPoint.y);
                        }
                        this.processing = true;
                    } else if (isReleased && dist(this.startingPoint.x, this.startingPoint.y, mouseX, mouseY) > scala / 2) {
                        if (app.snapToBlocks) {
                            const columns = width / scala;
                            const x = floor(mouseX / scala);
                            const y = floor(mouseY / scala);
                            const indexBlocco = x + columns * y;
                            this.endingPoint = createVector(blocchi[indexBlocco].x + scala / 2 - this.startingPoint.x, blocchi[indexBlocco].y + scala / 2 - this.startingPoint.y);
                        } else {
                            this.endingPoint = createVector(mouseX - this.startingPoint.x, mouseY - this.startingPoint.y);
                        }
                        this.processing = false;
                        this.drawQuota(disegno, this.startingPoint, this.endingPoint, "FF");
                    }
                },
                mouseEffect() {
                    if (this.processing) {
                        if (keyIsPressed && keyCode == 27) {
                            this.processing = false;
                        } else if (app.snapToBlocks) {
                            MODI.BLOCCO.mouseEffect();
                            const columns = width / scala;
                            const x = floor(mouseX / scala);
                            const y = floor(mouseY / scala);
                            const indexBlocco = x + columns * y;
                            this.endingPoint.x = blocchi[indexBlocco].x + scala / 2 - this.startingPoint.x;
                            this.endingPoint.y = blocchi[indexBlocco].y + scala / 2 - this.startingPoint.y;
                        } else {
                            this.endingPoint.x = mouseX - this.startingPoint.x;
                            this.endingPoint.y = mouseY - this.startingPoint.y;
                        }
                        this.drawQuota(mouseLayer, this.startingPoint, this.endingPoint, "BB");
                    } else {
                        mouseLayer.stroke(colore_matita.value + "BB");
                        mouseLayer.strokeWeight(3);
                        mouseLayer.line(mouseX, mouseY - 10, mouseX, mouseY + 10);
                        mouseLayer.line(mouseX - 5, mouseY - 10, mouseX + 5, mouseY - 10);
                        mouseLayer.line(mouseX - 5, mouseY + 10, mouseX + 5, mouseY + 10);
                    }
                },
                drawQuota(layer, startVector, endVector, alpha) {
                    let verso = false;
                    let startOffsetX = 0;
                    let startOffsetY = 0;
                    let endOffsetX = 0;
                    let endOffsetY = 0;
                    switch (true) {
                        case endVector.heading() >= -135 && endVector.heading() < -45:
                            verso = -90;
                            endVector.x = 0;
                            startOffsetY += scala / 2;
                            endOffsetY -= scala / 2;
                            break;
                        case endVector.heading() >= -45 && endVector.heading() < 45:
                            verso = 0;
                            endVector.y = 0;
                            startOffsetX -= scala / 2;
                            endOffsetX += scala / 2;
                            break;
                        case endVector.heading() >= 45 && endVector.heading() < 135:
                            verso = 90;
                            endVector.x = 0;
                            startOffsetY -= scala / 2;
                            endOffsetY += scala / 2;
                            break;
                        case endVector.heading() <= -135 || endVector.heading() >= 135:
                            verso = -180;
                            endVector.y = 0;
                            startOffsetX += scala / 2;
                            endOffsetX -= scala / 2;
                            break;
                        default:
                    }
                    layer.push();
                    layer.stroke(colore_matita.value + alpha);
                    layer.strokeWeight(3);
                    layer.translate(startVector.x + startOffsetX, startVector.y + startOffsetY);
                    layer.line(0, 0, endVector.x - startOffsetX + endOffsetX, endVector.y - startOffsetY + endOffsetY);
                    layer.rotate(radians(verso + 90));
                    layer.line(scala / 4, 0, -scala / 4, 0);
                    layer.rotate(radians(-verso - 90));
                    layer.push();
                    layer.translate(endVector.x + endOffsetX, endVector.y + endOffsetY);
                    layer.rotate(radians(verso + 90));
                    layer.line(scala / 4, -scala / 2, -scala / 4, -scala / 2);
                    layer.pop();
                    layer.pop();
                }
            },
            TESTO: {
                SHORTCUT: 84,                   // Tasto T
                placeHolder: "T",
                click(isReleased) {
                    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
                        if (isReleased && !this.processing) {
                            this.textContent = "";
                            this.posX = mouseX;
                            this.posY = mouseY;
                            this.processing = true;
                        } else {
                            this.posX = mouseX;
                            this.posY = mouseY;
                        }
                    } else {
                        this.processing = false;
                    }
                },
                newKey() {
                    if (this.processing) {
                        switch (keyCode) {
                            case 27:
                                this.processing = false;
                                break;
                            case 13:
                                this.processing = false;
                                if (this.textContent.toUpperCase() == "TNT") {
                                    this.textContent = "";
                                    app.setTool('TNT');
                                } else if (this.textContent.toUpperCase() == "BOOM") {
                                    this.textContent = "";
                                    app.boom();
                                } else if (this.textContent.length == 8 && this.textContent.substring(0, 6).toUpperCase() == "SCALA " && !isNaN(this.textContent.substring(6, 8))) {
                                    let inputScale = Number(this.textContent.substring(6, 8));
                                    app.newScale(inputScale, true);
                                    this.textContent = "";
                                } else if (this.textContent.length >= 8 && this.textContent.length <= 12 && this.textContent.substring(0, 5).toUpperCase() == "GRID ") {
                                    const input = this.textContent.substring(5, this.textContent.length).split(' ');
                                    const newWidth = Number(input[0]);
                                    const newHeight = Number(input[1]);
                                    if (!isNaN(newWidth) && !isNaN(newHeight)) {
                                        if (newWidth > minWidth / scala || newHeight > minHeight / scala) {
                                            if (newWidth > minWidth / scala && newHeight > minHeight / scala) {
                                                app.newCanvas("blocchi", newWidth, newHeight);
                                            } else if (newWidth > minWidth / scala) {
                                                app.newCanvas("blocchi", newWidth, minHeight / scala);
                                            } else if (newHeight > minHeight / scala) {
                                                app.newCanvas("blocchi", minWidth / scala, newHeight);
                                            }
                                        } else {
                                            app.newCanvas("blocchi", minWidth / scala, minHeight / scala);
                                        }
                                        this.textContent = "";
                                    } else if (this.textContent.toUpperCase() == "GRID FILL") {
                                        app.newCanvas("fullsizeCanvas");
                                        this.textContent = "";
                                    }
                                } else if (this.textContent.toUpperCase() == "PRINT") {
                                    app.togglePrintMode(!printMode);
                                    redraw();
                                    this.textContent = "";
                                }
                                MODI.DISEGNO.text(disegno, textSize, this.posX, this.posY, LEFT, "FF", this.textContent);
                                break;
                            case 8:
                                this.textContent = this.textContent.substring(0, this.textContent.length - 1);
                                break;
                            default:
                                if (key.length == 1) {
                                    this.textContent += key;
                                }
                        }
                    }
                },
                mouseEffect() {
                    if (this.processing) {
                        MODI.DISEGNO.text(mouseLayer, textSize, this.posX, this.posY, LEFT, "BB", this.textContent + "_");
                        if (this.textContent.substring(0, 6).toUpperCase() == "SCALA ") {
                            MODI.DISEGNO.text(mouseLayer, textSize * 0.75, this.posX, this.posY + 30, LEFT, "BB", scaleList);
                        }

                    } else {
                        this.posX = mouseX;
                        this.posY = mouseY;
                        MODI.DISEGNO.text(mouseLayer, textSize, this.posX, this.posY, CENTER, "BB", this.placeHolder);
                    }
                }
            }
        },
        click(tool, isReleased) {
            MODI.DISEGNO.TIPO[tool].click(isReleased);
        },
        mouseEffect(tool) {
            mouseLayer.clear();
            mouseLayer.noStroke();
            MODI.DISEGNO.TIPO[tool].mouseEffect();
        },
        text(layer, size, posX, posY, alignH, opacity, content) {
            layer.noStroke();
            layer.fill(colore_matita.value + opacity);
            layer.textAlign(alignH, CENTER);
            layer.textStyle(BOLD);
            layer.textFont("Cursive");
            layer.textSize(size);
            layer.text(content, posX, posY + 5);
        }
    }
}


const AZIONI = {
    TIMBRO: {
        INIZIO: {
            SHORTCUT: 73,                       // Tasto I
            timbroInizio() {
                AZIONI.TIMBRO.timbroAgent(agentInizio);
            }
        },
        FINE: {
            SHORTCUT: 79,                       // Tasto O
            timbroFine() {
                AZIONI.TIMBRO.timbroAgent(agentFine);
            }
        },
        timbroAgent(timbro) {
            disegno.imageMode(CENTER);
            disegno.push();
            disegno.translate(agent.x + scala / 2, agent.y + scala / 2);
            disegno.rotate(radians(agent.direction));
            disegno.tint(255, 175);
            disegno.image(timbro, 0, 0, scala - 4, scala - 4);
            disegno.pop();
        }
    },
    AGENT: {
        TURN_LEFT: {
            SHORTCUT: 37,                       // Freccia SINISTRA
            turnLeft() {
                agent.direction -= 90;
            }
        },
        TURN_RIGHT: {
            SHORTCUT: 39,                       // Freccia DESTRA
            turnRight() {
                agent.direction += 90;
            }
        }
    },
    NUMERI: {
        UP: {
            SHORTCUT: 38,                       // Freccia SU
            numberUp() {
                MODI.DISEGNO.TIPO.NUMERI.numeroTimbro++;
            }
        },
        DOWN: {
            SHORTCUT: 40,                       // Freccia GIÙ
            numberDown() {
                MODI.DISEGNO.TIPO.NUMERI.numeroTimbro--;
            }
        }
    },
    COLORI_MATITA: {
        ROSSO: {
            SHORTCUT: 90,	            	    // Tasto Z
            setCol() {
                colore_matita.value = "#DF1414";
                AZIONI.COLORI_MATITA.updateTool();
            }
        },
        VERDE: {
            SHORTCUT: 88,					    // Tasto X
            setCol() {
                colore_matita.value = "#14BB14";
                AZIONI.COLORI_MATITA.updateTool();
            }
        },
        BLU: {
            SHORTCUT: 67,					    // Tasto C
            setCol() {
                colore_matita.value = "#4040FF";
                AZIONI.COLORI_MATITA.updateTool();
            }
        },
        MARRONE: {
            SHORTCUT: 86,					    // Tasto V
            setCol() {
                colore_matita.value = "#775033";
                AZIONI.COLORI_MATITA.updateTool();
            }
        },
        GIALLO: {
            SHORTCUT: 66,					    // Tasto B
            setCol() {
                colore_matita.value = "#CCCC14";
                AZIONI.COLORI_MATITA.updateTool();
            }
        },
        ARANCIONE: {
            SHORTCUT: 78,					    // Tasto N
            setCol() {
                colore_matita.value = "#EE6600";
                AZIONI.COLORI_MATITA.updateTool();
            }
        },
        VIOLA: {
            SHORTCUT: 77,					    // Tasto M
            setCol() {
                colore_matita.value = "#850085";
                AZIONI.COLORI_MATITA.updateTool();
            }
        },
        BIANCO: {
            SHORTCUT: 188,                      // Tasto ,
            setCol() {
                colore_matita.value = "#AAAAAA";
                AZIONI.COLORI_MATITA.updateTool();
            }
        },
        updateTool() {
            if (app.currentLayer == "BLOCCO" || app.currentTool == "GOMMA") {
                app.setTool('MATITA');
            }
        }
    },
    SAVE: {
        IMAGE: {
            SHORTCUT: 80,                       // Tasto P
            saveImage() {
                const data = new Date().toISOString().slice(0, 10);
                if (keyIsPressed && keyCode == 16) {
                    app.togglePrintMode(true);
                    redraw();
                    saveCanvas(cvs, 'MinecraftSketch_' + data + "_PRINT", 'png');
                    app.togglePrintMode(false);
                } else if (printMode) {
                    saveCanvas(cvs, 'MinecraftSketch_' + data + "_PRINT", 'png');
                } else {
                    saveCanvas(cvs, 'MinecraftSketch_' + data, 'png');
                }
            }
        }
    }
}