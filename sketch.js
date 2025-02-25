class Pelota {
  constructor(x, y, size, vx, vy) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.vx = vx;
    this.vy = vy;
    this.reset();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x > width - this.size / 2 || this.x < this.size / 2) {
      sonidoPunto.play();
      if (this.x > width - this.size / 2) {
        puntosJugador++;
      } else {
        puntosComputadora++;
      }
      narrarPuntos();
      this.reset();
    }
    if (this.y > height - this.size / 2 || this.y < this.size / 2) {
      this.vy *= -1;
    }

    if (
      colision(
        this.x,
        this.y,
        this.size,
        raqueta.x,
        raqueta.y,
        raqueta.width,
        raqueta.height
      ) ||
      colision(
        this.x,
        this.y,
        this.size,
        raqueta2.x,
        raqueta2.y,
        raqueta2.width,
        raqueta2.height
      )
    ) {
      sonidoRaqueta.play();
      this.vx *= -1;
      this.vx *= 1.05;
      this.vy *= 1.05;
    }
    this.checkCollision();
    if (this.collisionOccurred) {
      this.drawCollisionEffect();
    }
  }

  reset() {
    this.x = 400;
    this.y = 200;
    this.vx = 5 * (Math.random() < 0.5 ? -1 : 1);
    this.vy = 5 * (Math.random() < 0.5 ? -1 : 1);
  }

  draw() {
    // Crear un efecto de estrella fugaz más sutil y transparente
    for (let i = 0; i < 5; i++) {
      fill(lerpColor(color(0, 255, 255, 50), color(0, 0, 0, 50), i / 5));
      ellipse(this.x - this.vx * i, this.y - this.vy * i, this.size, this.size);
    }
    // Dibujar la pelota circular sin transparencia
    fill(0, 255, 255);
    ellipse(this.x, this.y, this.size, this.size);
    
    // Agregar un borde negro dentro de la pelota
    noFill();
    stroke(0);
    strokeWeight(2);
    ellipse(this.x, this.y, this.size - 4, this.size - 4);
  }

  // Método para dibujar el efecto de estrella fugaz cuando colisiona
  drawCollisionEffect() {
    for (let i = 0; i < 10; i++) {
      fill(lerpColor(color(0, 255, 255, 50), color(0, 0, 0, 50), i / 10));
      ellipse(this.x - this.vx * i, this.y - this.vy * i, this.size, this.size);
    }
  }

  // Método para verificar si ocurrió una colisión
  checkCollision() {
    this.collisionOccurred = colision(
      this.x,
      this.y,
      this.size,
      raqueta.x,
      raqueta.y,
      raqueta.width,
      raqueta.height
    ) || colision(
      this.x,
      this.y,
      this.size,
      raqueta2.x,
      raqueta2.y,
      raqueta2.width,
      raqueta2.height
    );
  }
}

class Raqueta {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = 0; // 0: estacionario, -1: arriba, 1: abajo
  }

  update() {
    let previousY = this.y;

    // Raqueta del jugador sigue el mouse
    if (this === raqueta) {
      this.y = mouseY;
    }

    // Raqueta de la computadora sigue la pelota
    if (this === raqueta2) {
      let targetY = pelota.y - this.height / 2;
      this.y += (targetY - this.y) * 0.2;
    }

    // Limitar el movimiento dentro de los límites de la pantalla
    this.y = constrain(this.y, 0, height - this.height);

    // Determinar la dirección del movimiento
    if (this.y < previousY) {
      this.direction = -1; // Arriba
    } else if (this.y > previousY) {
      this.direction = 1; // Abajo
    } else {
      this.direction = 0; // Estacionario
    }
  }

  draw() {
    // Sombra tipo "estrella fugaz"
    for (let i = 0; i < 10; i++) {
      let shadowY =
        this.direction === -1
          ? this.y + this.speed * i
          : this.y - this.speed * i;

      if (this === raqueta) {
        // Sombra verde
        fill(lerpColor(color(0, 255, 0, 100), color(0, 0, 0, 0), i / 10));
      } else if (this === raqueta2) {
        // Sombra roja
        fill(lerpColor(color(255, 0, 0, 100), color(0, 0, 0, 0), i / 10));
      }

      noStroke();
      rect(this.x, shadowY, this.width, this.height, 15); // Redondeamos la sombra
    }

    // Aplicar degradado a la raqueta
    for (let i = 0; i < this.height; i++) {
      let inter = map(i, 0, this.height, 0, 1);
      let c;

      if (this === raqueta) {
        // Degradado verde neón y negro para el jugador
        c = lerpColor(color(0, 255, 0), color(0, 0, 0), inter);
      } else if (this === raqueta2) {
        // Degradado rojo neón y negro para la computadora
        c = lerpColor(color(0, 0, 0), color(255, 0, 0), inter);
      }

      stroke(c);
      strokeWeight(2);
      line(this.x, this.y + i, this.x + this.width, this.y + i);
    }

    // Dibujar el contorno redondeado sin tapar el degradado
    noFill();
    strokeWeight(3);
    if (this === raqueta) {
      stroke(34, 139, 34, 200); // Verde con transparencia
    } else {
      stroke(255, 69, 0, 200); // Rojo con transparencia
    }
    rect(this.x, this.y, this.width, this.height, 20); // Bordes redondeados

    // Efecto de brillo en los bordes
    stroke(255, 255, 255, 150); // Blanco transparente
    strokeWeight(2);
    line(this.x, this.y, this.x + this.width, this.y); // Brillo arriba
    line(
      this.x,
      this.y + this.height,
      this.x + this.width,
      this.y + this.height
    ); // Brillo abajo
  }
}

//verificar la colision entre una circunferencia y un rectangulo
//circunferencia cx, cy, diametro
//rectangulo rx, ry, width, height
function colision(cx, cy, diameter, rx, ry, rw, rh) {
  //Si el circulo esta a la izquierda del rectangulo
  if (cx + diameter / 2 < rx) {
    return false;
  }
  //Si el circulo esta arriba del rectangulo
  if (cy + diameter / 2 < ry) {
    return false;
  }
  //Si el circulo esta a la derecha del rectangulo
  if (cx - diameter / 2 > rx + rw) {
    return false;
  }
  //Si el circulo esta abajo del rectangulo
  if (cy - diameter / 2 > ry + rh) {
    return false;
  }
  return true;
}

let sonidoRaqueta;
let sonidoPunto;
let puntosJugador = 0;
let puntosComputadora = 0;
let juegoIniciado = false;
let pelota, raqueta, raqueta2;

function preload() {
  sonidoRaqueta = loadSound("raqueta.wav");
  sonidoPunto = loadSound("punto.wav");
}

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent("canvas-container");
  canvas.style("display", "block");
  canvas.style("transform", "translate(-50%, -50%)");
  canvas.style("top", "50%");
  canvas.style("left", "50%");

  pelota = new Pelota(400, 200, 30, 5, 5);
  raqueta = new Raqueta(30, 150, 20, 100, 5);
  raqueta2 = new Raqueta(750, 150, 20, 100, 5);

  // Botón de inicio
  const startButton = select("#start-btn");
  startButton.mousePressed(iniciarJuego);
}

function iniciarJuego() {
  juegoIniciado = true;
  puntosJugador = 0;
  puntosComputadora = 0;
  narrarPuntos();
  select("#start-btn").hide();
  loop();
}

function draw() {
  background(0);
  drawNeonBackground();

  fill(255);
  textAlign(CENTER, CENTER);

  if (juegoIniciado) {
    // Si el juego ha comenzado, actualizamos y dibujamos todos los elementos
    actualizarJuego();
    mostrarPuntajes();

    // Verificar si alguien alcanzó los 5 puntos
    if (puntosJugador >= 5 || puntosComputadora >= 5) {
      reiniciarJuego(); // Reiniciar el juego si alguna parte alcanza 5 puntos
    }
  } else {
    // Mostrar instrucciones iniciales
    mostrarInstrucciones();
  }
}

function actualizarJuego() {
  pelota.update();
  pelota.draw();
  raqueta.update();
  raqueta.draw();
  raqueta2.update();
  raqueta2.draw();
}

function mostrarPuntajes() {
  textSize(24);
  fill(255, 255, 0); // Color amarillo neón
  textAlign(CENTER, TOP);
  // Sombra del texto
  fill(0, 0, 0, 150);
  text(
    `Jugador: ${puntosJugador}  Computadora: ${puntosComputadora}`,
    width / 2 + 2,
    32
  );
  // Texto principal
  fill(255, 255, 0);
  text(
    `Jugador: ${puntosJugador}  Computadora: ${puntosComputadora}`,
    width / 2,
    30
  );
}

function reiniciarJuego() {
  juegoIniciado = false; // Cambiar el estado a no iniciado
  noLoop(); // Detener el ciclo de dibujo

  // Reiniciar las variables del juego
  puntosJugador = 0;
  puntosComputadora = 0;

  // Resetear la posición de la pelota y las raquetas
  pelota.reset();
  raqueta.y = 150;
  raqueta2.y = 150;

  // Mostrar el mensaje inicial y el botón de inicio
  mostrarInstrucciones();

  // Mostrar el botón de inicio
  select("#start-btn").show(); // Mostrar el botón de inicio
}

function mostrarInstrucciones() {
  background(0);
  drawNeonBackground();

  // Texto principal
  fill(0, 255, 255); // Color cian neón
  textSize(32);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(
    "Haz click en el botón para iniciar el juego",
    width / 2,
    height / 2 - 50
  );

  // Sombra del texto principal
  fill(0, 255, 255, 100); // Sombra cian neón
  text(
    "Haz click en el botón para iniciar el juego",
    width / 2 + 2,
    height / 2 - 48
  );

  // Texto secundario
  fill(255, 0, 255); // Color rosa neón
  textSize(24);
  textStyle(NORMAL);
  text("Usa el mouse para mover la raqueta", width / 2, height / 2 + 20);

  // Sombra del texto secundario
  fill(255, 0, 255, 100); // Sombra rosa neón
  text("Usa el mouse para mover la raqueta", width / 2 + 2, height / 2 + 22);
}

function narrarPuntos() {
  //narra los puntos utilizando la api speechapi
  let mensaje = new SpeechSynthesisUtterance();
  mensaje.lang = "es-MX";
  mensaje.volume = 1; // 0 a 1
  mensaje.rate = 1; // 0.1 a 10
  mensaje.pitch = 1; // 0 a 2
  if (puntosJugador >= 5) {
    mensaje.text = "Ganaste";
  } else if (puntosComputadora >= 5) {
    mensaje.text = "Perdiste";
  } else {
    mensaje.text = `Jugador: ${puntosJugador}. Computadora: ${puntosComputadora}`;
  }
  speechSynthesis.speak(mensaje);
}

function drawNeonBackground() {
  for (let i = 0; i < height; i += 10) {
    stroke(lerpColor(color(0, 0, 0), color(0, 255, 255, 50), i / height));
    line(0, i, width, i);
  }
}

function createPaintDrip() {
  const drip = document.createElement("div");
  drip.classList.add("paint-drip");

  // Lista de colores neón
  const colors = [
    { base: "#ff0080", glow: "rgba(255, 0, 128, 0.8)" },
    { base: "#00ffea", glow: "rgba(0, 255, 234, 0.8)" },
    { base: "#39ff14", glow: "rgba(57, 255, 20, 0.8)" },
    { base: "#ffea00", glow: "rgba(255, 234, 0, 0.8)" },
    { base: "#8000ff", glow: "rgba(128, 0, 255, 0.8)" },
  ];

  // Seleccionar un color aleatorio
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Determinar en qué borde aparecerá (arriba, abajo, izquierda, derecha)
  const side = Math.floor(Math.random() * 4);
  let x, y;

  switch (side) {
    case 0: // Arriba
      x = Math.random() * 100;
      y = Math.random() * 10;
      break;
    case 1: // Abajo
      x = Math.random() * 100;
      y = 90 + Math.random() * 10;
      break;
    case 2: // Izquierda
      x = Math.random() * 10;
      y = Math.random() * 100;
      break;
    case 3: // Derecha
      x = 90 + Math.random() * 10;
      y = Math.random() * 100;
      break;
  }

  // Aplicar color y efecto neón
  drip.style.background = color.base;
  drip.style.boxShadow = `0 0 10px ${color.glow}, 0 0 20px ${color.glow}, 0 0 40px ${color.glow}`;
  drip.style.left = `${x}%`;
  drip.style.top = `${y}%`;

  document.body.appendChild(drip);

  // Elimina la mancha después de la animación
  setTimeout(() => {
    drip.remove();
  }, 3000);
}

// Crear manchas de pintura cada 800ms
setInterval(createPaintDrip, 800);
