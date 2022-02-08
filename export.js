// Minecraft Sketch - Version 0.4 (03-Dec-2021) by Andrés Staccioli
// Last Update export.js: 07-Nov-2021

function exportCode() {
    const top = controlArea().top;
    const left = controlArea().left;
    const right = controlArea().right;
    const bottom = controlArea().bottom;
    const areaWidth = right - (left - 1);
    const areaHeight = bottom - (top - 1);

    let materiali = {
        VUOTO: 12,
        PROGETTATO: 1,
        PIAZZATO: 2,
        BIANCO: 3,
        ROSSO: 4,
        VERDE: 5,
        BLU: 6,
        GRIGIO: 7,
        GIALLO: 8,
        VIOLA: 9,
        ARANCIONE: 10,
        NERO: 11,
    }

    let blocksStatus = [];

    for (let i = 0; i < blocchi.length; i++) {
        const col = floor(blocchi[i].x / scala);
        const row = floor(blocchi[i].y / scala);
        if (col >= left && col <= right && row >= top && row <= bottom) {
            blocksStatus.push(materiali[blocchi[i].status]);
        }
    }

    let exportingCode = `
let imported: number[] = []
let width = 0
let height = 0
let index = 0
// Se viene avviato da solo il comando chat "sketch", la costruzione viene realizzata in orizzontale.
// 
// Per avviare la costruzione in verticale, inviare comando chat con parametro 1: "sketch 1".
player.onChat("sketch", function (vertical) {
    imported = [${blocksStatus}]
    width = ${areaWidth}
    height = ${areaHeight}
    agent.move(UP, 1)
    agent.setItem(BROWN_CONCRETE, 1, 2)
    agent.setItem(WHITE_CONCRETE, 1, 3)
    agent.setItem(RED_CONCRETE, 1, 4)
    agent.setItem(LIME_CONCRETE, 1, 5)
    agent.setItem(BLUE_CONCRETE, 1, 6)
    agent.setItem(LIGHT_GRAY_CONCRETE, 1, 7)
    agent.setItem(YELLOW_CONCRETE, 1, 8)
    agent.setItem(PINK_CONCRETE, 1, 9)
    agent.setItem(ORANGE_CONCRETE, 1, 10)
    agent.setItem(BLACK_CONCRETE, 1, 11)
    if (vertical == 0) {
        buildSketch_horizontal()
    } else {
        buildSketch_vertical()
    }
})
function buildLine () {
    if (imported[index] == 12 || imported[index] == 1) {
        agent.move(FORWARD, 1)
    } else {
        agent.setSlot(imported[index])
        agent.place(DOWN)
        agent.move(FORWARD, 1)
    }
    index += 1
}

function buildSketch_vertical () {
    index = width * (height - 1)
    for (let index2 = 0; index2 < height; index2++) {
        for (let index2 = 0; index2 < width; index2++) {
            buildLine()
        }
        index += 0 - 2 * width
        agent.move(BACK, width)
        agent.move(UP, 1)
    }
}

function buildSketch_horizontal () {
    index = 0
    for (let index2 = 0; index2 < height; index2++) {
        for (let index2 = 0; index2 < width; index2++) {
            buildLine()
        }
        agent.move(BACK, width)
        agent.move(RIGHT, 1)
    }
}`;

    function controlArea() {
        return {
            top: checkTop(),
            left: checkLeft(),
            right: checkRight(),
            bottom: checkBottom()
        }

        function checkTop() {
            for (let b of blocchi) {
                if (b.status != 'VUOTO') {
                    return floor(b.y / scala);
                }
            }

        }

        function checkLeft() {
            const columns = width / scala;
            for (let x = 0; x < columns; x++) {
                for (let i = x; i < blocchi.length; i += columns) {
                    if (blocchi[i].status != 'VUOTO') {
                        return floor(blocchi[i].x / scala);
                    }
                }
            }
        }

        function checkRight() {
            const columns = width / scala;
            for (let x = columns - 1; x >= 0; x--) {
                for (let i = blocchi.length - 1 - (columns - x); i > x; i -= columns) {
                    if (blocchi[i].status != 'VUOTO') {
                        return floor(blocchi[i].x / scala);
                    }
                }
            }
        }

        function checkBottom() {
            for (let i = blocchi.length - 1; i > 0; i--) {
                if (blocchi[i].status != 'VUOTO') {
                    return floor(blocchi[i].y / scala);
                }
            }
        }
    }

    let copyThis = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        const selected =
            document.getSelection().rangeCount > 0
                ? document.getSelection().getRangeAt(0)
                : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }
        alert("Codice copiato. Ora vai su Minecraft Education Edition, apri il Code Builder, vai su JavaScript ed incolla tutto con Ctrl+V.\n\nPrego ;)");
    };

    copyThis(exportingCode);
}