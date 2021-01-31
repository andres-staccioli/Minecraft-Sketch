var cvs, disegno, agent;
var scala = 40;
var verde_fill, verde_stroke, progettato_stroke, marrone_fill, marrone_stroke, grigio_fill, grigio_stroke, rosso_fill, rosso_stroke;
var blocchi = [];

var modoBlocchi = true;
var modoDisegno = false;
var mostrareBlocchi = true;
var mostrareDisegno = true;
var agentImg, agentInizio, agentFine;

var mouseMode = '1';

var mouseLayer;
var mouseEffect = true;

var numeroTimbro = 1;

var pulsanti = document.getElementsByTagName("button");
for (var i = 0; i < pulsanti.length; i++) {
  pulsanti[i].onclick = function () {
    pulsante(this.id);
  };
}


function preload() {
  agentImg = loadImage('agent-freccia.png');
  agentInizio = loadImage('agent-freccia_verde.png');
  agentFine = loadImage('agent-freccia_rosso.png');
}


function setup() {
  cvs = createCanvas(840, 480);
  cvs.parent('canvas');
  pixelDensity(1);
  disegno = createGraphics(width, height);
  mouseLayer = createGraphics(width, height);
  colori();
  for (let y = 1; y < height; y += scala) {
    for (let x = 1; x < width; x += scala) {
      blocchi.push(new Blocco(x, y));
    }
  }
  agent = new Agent(blocchi[0].x, blocchi[0].y);
  mouseLayer.noStroke();
}


function draw() {
  mouseLayer.clear();
  if (mouseMode == 'E') {
    // mouseLayer.ellipse(mouseX, mouseY, 30);
    mouseLayer.fill(colore_matita.value);
    mouseLayer.ellipse(mouseX, mouseY, 5);
    mouseEffect = false;
    mouseLayer.fill(255, 25);
  } else if (mouseMode == 'R') {
    mouseLayer.ellipse(mouseX, mouseY, 30);
    mouseEffect = false;
    mouseLayer.fill(255, 25);
  } else if (mouseMode == 'N') {
    mouseLayer.fill(colore_matita.value + "BB");
    mouseLayer.textAlign(CENTER, CENTER);
    mouseLayer.textStyle(BOLD);
    mouseLayer.textFont("Cursive");
    mouseLayer.textSize(25);
    mouseLayer.text(numeroTimbro, mouseX, mouseY+5);
    mouseLayer.fill(255, 25);
    mouseEffect = false;
  } else {
    mouseEffect = true;
  }
  disegno.strokeWeight(3);
  disegno.stroke(colore_matita.value);
  if (modoBlocchi) {
    mostrareBlocchi = true;
  }
  if (modoDisegno) {
    mostrareDisegno = true;
  }
  if (!mostrareBlocchi) {
    modoBlocchi = false;
  }
  if (!mostrareDisegno) {
    modoDisegno = false;
  }
  for (let b of blocchi) {
    b.mostrare();
  }
  if (mouseIsPressed) {
    if (modoBlocchi) {
      for (let b of blocchi) {
        b.click();
      }
    } else if (modoDisegno && mouseMode == 'E') {
      disegno.line(pmouseX, pmouseY, mouseX, mouseY);
    } else if (modoDisegno && mouseMode == 'R') {
      disegno.erase();
      disegno.strokeWeight(30);
      disegno.line(pmouseX, pmouseY, mouseX, mouseY);
      disegno.noErase();
    }
  }
  if (mostrareDisegno) {
    image(disegno, width / 2, height / 2);
  }
  agent.mostrare();
  image(mouseLayer, width / 2, height / 2);
}

function mouseReleased() {
  if (modoDisegno && mouseMode == 'N') {
    disegno.noStroke();
    disegno.fill(colore_matita.value);
    disegno.textAlign(CENTER, CENTER);
    disegno.textStyle(BOLD);
    disegno.textFont("Cursive");
    disegno.textSize(25);
    disegno.text(numeroTimbro, mouseX, mouseY+5);
    disegno.fill(255, 25);
    numeroTimbro++;
  }
}

function keyPressed() {
  switch (keyCode) {
    case 65:  // Tasto "A"
    case 81:  // Tasto "Q"
    case 49:  // Tasto "1"
    case 50:  // Tasto "2"
    case 51:  // Tasto "3"
    case 52:  // Tasto "4"
      modoBlocchi = true;
      modoDisegno = false;
      mouseMode = key.toUpperCase();
      break;
    case 69:  // Tasto "E"
    case 82:  // Tasto "R"
    case 78:  // Tasto "N"
      modoBlocchi = false;
      modoDisegno = true;
      mouseMode = key.toUpperCase();
      numeroTimbro = 1;
      break;
    case 73:  // Tasto "I"
      timbroAgent(agentInizio);
      break;
    case 79:  // Tasto "O"
      timbroAgent(agentFine);
      break;
    case 80:  // Tasto "P"
      salvarePNG();
      break;
    case RIGHT_ARROW:
      agent.status += 1;
      if (agent.status == 5) {
        agent.status = 1;
      }
      break;
    case LEFT_ARROW:
      agent.status -= 1;
      if (agent.status == 0) {
        agent.status = 4;
      }
      break;
      case UP_ARROW:
        if (mouseMode == 'N') {
          numeroTimbro++;
        }
        break;
      case DOWN_ARROW:
        if (mouseMode == 'N') {
          numeroTimbro--;
        }
        break;

  }
}





function pulsante(id) {
  switch (id) {
    case 'show-blocchi':
      vistaBlocchi();
      break;
    case 'show-disegno':
      console.log("Funca pero...");
      vistaDisegno();
      break;
    case 'delete-blocchi':
      cancellareBlocchi();
      break;
    case 'delete-disegno':
      cancellareDisegno();
      break;
    case 'btn_vuoto':
      mostrareBlocchi = true;
      modoDisegno = false;
      setMouseMode('Q');
      break;
    case 'btn_progettato':
      mostrareBlocchi = true;
      setMouseMode('1');
      break;
    case 'btn_piazzato':
      mostrareBlocchi = true;
      setMouseMode('2');
      break;
    case 'btn_altro':
      mostrareBlocchi = true;
      setMouseMode('3');
      break;
    case 'btn_attenzione':
      mostrareBlocchi = true;
      setMouseMode('4');
      break;
    case 'btn_agent':
      setMouseMode('A');
      break;
    case 'btn_matita':
      setMouseMode('E');
      break;
    case 'btn_inizio':
      timbroAgent(agentInizio);
      break;
    case 'btn_fine':
      timbroAgent(agentFine);
      break;
    case 'btn_numeri':
      numeroTimbro = 1;
      setMouseMode('N');
      break;
    case 'btn_gomma':
      setMouseMode('R');
      break;
    case 'btn_salva':
      salvarePNG();
      break;
  }
}


function vistaBlocchi() {
  mostrareBlocchi = !mostrareBlocchi;
  if (mostrareBlocchi) {
    modoBlocchi = true;
    document.getElementById('show-blocchi').innerHTML = '<i class="fas fa-eye">';
  } else {
    modoBlocchi = false;
    document.getElementById('show-blocchi').innerHTML = '<i class="fas fa-eye-slash"></i>';
  }
}

function vistaDisegno() {
  mostrareDisegno = !mostrareDisegno;
  if (mostrareDisegno) {
    modoDisegno = true;
    document.getElementById('show-disegno').innerHTML = '<i class="fas fa-eye">';
  } else {
    modoDisegno = false;
    document.getElementById('show-disegno').innerHTML = '<i class="fas fa-eye-slash"></i>';
  }
}

function cancellareBlocchi() {
  for (let b of blocchi) {
    b.status = 11;
  }
}

function cancellareDisegno() {
  disegno.erase();
  disegno.rect(0, 0, width, height);
  disegno.noErase();
}

function setMouseMode(m) {
  if (m == 'A' || m == 'Q' || m == '1' || m == '2' || m == '3' || m == '4') {
    modoBlocchi = true;
    modoDisegno = false;
  } else if (m == 'E' || m == 'R' || m == 'N') {
    modoBlocchi = false;
    modoDisegno = true;
  }
  mouseMode = m;
}

function timbroAgent(timbro) {
  disegno.imageMode(CENTER);
  disegno.angleMode(DEGREES);
  disegno.push();
  disegno.translate(agent.x + scala / 2, agent.y + scala / 2);
  switch (agent.status) {
    case 1:
      disegno.rotate(0);
      break;
    case 2:
      disegno.rotate(90);
      break;
    case 3:
      disegno.rotate(180);
      break;
    case 4:
      disegno.rotate(270);
      break;
  }
  disegno.tint(255, 175);
  disegno.image(timbro, 0, 0);
  disegno.pop();
}


function salvarePNG() {
  mouseEffect = false;
  setTimeout(function () {
    const data = new Date().toISOString().slice(0, 10);
    saveCanvas(cvs, 'MinecraftSketch_' + data, 'png');
    mouseEffect = true;
  }, 20);
}


function colori() {
  verde_fill = color(30, 60, 30);
  verde_stroke = color(20, 40, 20);
  giallo_stroke = color(200, 180, 32);
  marrone_fill = color(134, 89, 45);
  marrone_stroke = color(96, 64, 32);
  grigio_fill = color(127);
  grigio_stroke = color(80);
  rosso_fill = color(150, 0, 0);
  rosso_stroke = color(100, 0, 0);
}


class Blocco {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.status = 11;
  }

  mostrare() {
    strokeWeight(2);
    if (mostrareBlocchi) {
      switch (this.status) {
        case 11: // Spazio vuoto
          fill(verde_fill);
          stroke(verde_stroke);
          break;
        case 1: // Blocco progettato
          fill(verde_fill);
          stroke(giallo_stroke);
          break;
        case 2: // Blocco piazzato
          fill(marrone_fill);
          stroke(marrone_stroke);
          break;
        case 3: // Blocco altro
          fill(colore_blocco.value);
          stroke(grigio_stroke);
          break;
        case 4: // Blocco attenzione
          fill(rosso_fill);
          stroke(rosso_stroke);
          break;
        case 12: // Agent
          break;
      }
    } else {
      fill(verde_fill);
      stroke(verde_stroke);
    }
    rect(this.x, this.y, scala - 2, scala - 2);
    if (mouseEffect && mouseX >= this.x && mouseX < this.x + scala && mouseY >= this.y && mouseY < this.y + scala) {
      mouseLayer.noStroke();
      mouseLayer.fill(255, 25);
      mouseLayer.rect(this.x, this.y, scala - 2, scala - 2);
    }
  }

  click() {
    if (mouseX >= this.x && mouseX < this.x + scala && mouseY >= this.y && mouseY < this.y + scala) {
      switch (mouseMode) {
        case '1':
          this.status = 1;
          break;
        case '2':
          this.status = 2;
          break;
        case '3':
          this.status = 3;
          break;
        case '4':
          this.status = 4;
          break;
        case 'Q':
          this.status = 11;
          break;
        case 'A':
          agent.x = this.x;
          agent.y = this.y;
          break;
        // case 'D':
        //   this.status = 13;
        //   break;
      }
    }
  }
}


class Agent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.status = 1;
  }

  mostrare() {
    imageMode(CENTER);
    angleMode(DEGREES);
    push();
    translate(this.x + scala / 2, this.y + scala / 2);
    switch (this.status) {
      case 1:
        rotate(0);
        break;
      case 2:
        rotate(90);
        break;
      case 3:
        rotate(180);
        break;
      case 4:
        rotate(270);
        break;
    }
    image(agentImg, 0, 0);
    pop();
  }
}
