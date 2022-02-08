// Minecraft Sketch - Version 0.4 (03-Dec-2021) by Andrés Staccioli
// Last Update script.js: 07-Nov-2021

let scala = 40;             // Default scale
let scaleList = [20, 30, 40, 50, 60];
let width = 840;
let height = 480;
const minWidth = 0;
const minHeight = 0;
const minScale = 20;
const maxScale = 60;
let printMode = false;

const textSize = 25;

const app = new App('BLOCCO', 'PROGETTATO');    // Default layer + Default tool
const blocchi = [];
const IMAGES = [];

let cvs, disegno, mouseLayer, agent;
let agentImg, agentInizio, agentFine;
let portaImg, lastraImg, piantaImg, semiImg;

let tntSound;
let blocksLayer;
let lastBlock;

function preload() {
  agentImg = loadImage('images/agent-freccia.png');
  agentInizio = loadImage('images/agent-freccia_verde.png');
  agentFine = loadImage('images/agent-freccia_rosso.png');
  portaImg = loadImage(MODI.BLOCCO.TIPO.PORTA.FILE);
  lastraImg = loadImage(MODI.BLOCCO.TIPO.LASTRA.FILE);
  piantaImg = loadImage(MODI.BLOCCO.TIPO.PIANTA.FILE);
  semiImg = loadImage(MODI.BLOCCO.TIPO.SEMI.FILE);
  IMAGES["PORTA"] = portaImg;
  IMAGES["LASTRA"] = lastraImg;
  IMAGES["PIANTA"] = piantaImg;
  IMAGES["SEMI"] = semiImg;
  tntImg = loadImage(MODI.BLOCCO.TIPO.TNT.FILE);
  IMAGES["TNT"] = tntImg;
  tntSound = loadSound('tnt.mp3');
}


function setup() {
  // app.newCanvas("blocchi",width/scala,height/scala);
  app.newCanvas("fullsizeCanvas");
}


function draw() {
  image(blocksLayer, width / 2, height / 2);
  image(disegno, width / 2, height / 2);
  agent.show();
  MODI[app.currentLayer].mouseEffect(app.currentTool);
  image(mouseLayer, width / 2, height / 2);

  if (mouseIsPressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    MODI[app.currentLayer].click(app.currentTool);
  }
  if (printMode) {
    filter(GRAY);
  }
}


function mouseReleased() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    MODI[app.currentLayer].click(app.currentTool, true);
  }
  return false;
}


function keyPressed() {
  app.keyPressed();
  return false;
}