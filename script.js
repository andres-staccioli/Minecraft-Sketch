const scala = 40;             // Default scale (programmare opzioni: 30, 40, 60)
const width = 840;
const height = 480;

const app = new App('BLOCCO', 'PROGETTATO');    // Default layer + Default tool
const blocchi = [];
const IMAGES = [];

let cvs, disegno, mouseLayer, agent;
let agentImg, agentInizio, agentFine;
let portaImg, lastraImg, piantaImg, semiImg;


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
}


function setup() {
  cvs = createCanvas(width, height);
  cvs.parent('canvas');
  pixelDensity(1);
  disegno = createGraphics(width, height);
  mouseLayer = createGraphics(width, height);
  mouseLayer.noStroke();
  disegno.strokeCap(ROUND);
  disegno.strokeJoin(ROUND);
  mouseLayer.strokeCap(ROUND);
  mouseLayer.strokeJoin(ROUND);
  for (let y = 1; y < height; y += scala) {
    for (let x = 1; x < width; x += scala) {
      blocchi.push(new Blocco(x, y));
    }
  }
  agent = new Agent(blocchi[0].x, blocchi[0].y);
}


function draw() {
  for (let b of blocchi) {
    b.show();
  }
  image(disegno, width / 2, height / 2);
  agent.show();
  MODI[app.currentLayer].mouseEffect(app.currentTool);
  image(mouseLayer, width / 2, height / 2);

  if (mouseIsPressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    MODI[app.currentLayer].click(app.currentTool);
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