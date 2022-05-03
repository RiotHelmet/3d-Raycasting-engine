var canvas = document.getElementById("canvas");
var canvas2 = document.getElementById("canvas2");
var ctx = canvas.getContext("2d");
var ctx2 = canvas2.getContext("2d");

var mousePos = {
  x: 0,
  y: 0,
};

console.log(mousePos);
ctx.lineWidth = "2";

let keys = [];

class line {
  constructor(x1, y1, x2, y2) {
    this.a = { x: x1, y: y1 };
    this.b = { x: x2, y: y2 };
    objects.push(this);
  }
  show() {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }
}
class Circle {
  constructor(x, y, r) {
    this.pos = { x: x, y: y };
    this.r = r;
    this.velocity = { x: 0, y: 0 };
    this.speed = 3;
    this.color = "white";
    objects.push(this);
  }
  show() {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
    // ctx.fillStyle = "white";
    // ctx.fill();
    ctx.stroke();
  }
}
class rayCircle {
  constructor(x, y, r) {
    this.pos = { x: x, y: y };
    this.r = r;
    rayCircles.push(this);
  }
  show() {
    if (this.r > 0) {
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
      // ctx.fillStyle = "white";
      // ctx.fill();
      ctx.stroke();
    }
  }
}
class rayLine {
  constructor(x1, y1, x2, y2, style) {
    this.a = { x: x1, y: y1 };
    this.b = { x: x2, y: y2 };
    rayLines.push(this);
    this.strokeStyle = style;
  }
  show() {
    ctx.strokeStyle = this.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }
}

var objects = [];
var rayCircles = [];
var rayLines = [];
var pointList = [];
var hitList = [];

Player = new Circle(200, 100, 5);

p2 = new Circle(800, 400, 100);

p3 = new Circle(800, 700, 50);

p4 = new Circle(450, 500, 70);

p5 = new Circle(600, 300, 10);

p6 = new Circle(900, 500, 10);

class point {
  constructor(a, b) {
    this.pos = {
      x: a,
      y: b,
    };
    pointList.push(this);
  }
}

canvas.addEventListener("mousemove", function (e) {
  mousePos.x = e.offsetX;
  mousePos.y = e.offsetY;
});

function dist(a, b) {
  x1 = a.x;
  y1 = a.y;
  x2 = b.x;
  y2 = b.y;
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function edgeDist(a, b) {
  return dist(a.pos, b.pos) - b.r;
}

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function radians_to_degrees(rad) {
  var pi = Math.PI;
  return rad * (180 / pi);
}

function lineDir(origin, dir) {
  rayLines = [];
  x = Math.cos(dir) * 1000000;
  y = Math.sin(dir) * 1000000;
  ray = new rayLine(origin.x, origin.y, x + origin.x, origin.y + y);
}

function Dir(origin, other) {
  x = other.x;
  y = other.y;
  x1 = origin.x;
  y1 = origin.y;
  return Math.atan2(y - origin.y, x - origin.x);
}

function march(origin, dir) {
  stepSize = edgeDist(origin, objects[getClosest(origin, origin)]);
  raySize = stepSize;
  nextPoint = new point(
    Math.cos(dir) * stepSize + origin.pos.x,
    Math.sin(dir) * stepSize + origin.pos.y
  );

  for (j = 0; j < Infinity; j++) {
    stepSize = edgeDist(nextPoint, objects[getClosest(Player, nextPoint)]);
    raySize += stepSize;
    // ray = new rayCircle(nextPoint.pos.x, nextPoint.pos.y, stepSize);
    nextPoint.pos.x += Math.cos(dir) * stepSize;
    nextPoint.pos.y += Math.sin(dir) * stepSize;

    if (edgeDist(nextPoint, objects[getClosest(Player, nextPoint)]) < 1) {
      hitList.push(nextPoint);
      break;
    } else if (nextPoint.pos.x < 0) {
      break;
    } else if (nextPoint.pos.y < 0) {
      break;
    } else if (nextPoint.pos.x > 1250) {
      break;
    } else if (nextPoint.pos.y > 750) {
      break;
    }
  }
  ray = new rayLine(
    origin.pos.x,
    origin.pos.y,
    Math.cos(dir) * raySize + origin.pos.x,
    Math.sin(dir) * raySize + origin.pos.y,
    "rgba(255, 255, 255, 0.05)"
  );
}
function getClosest(origin, pos) {
  minDist = Infinity;
  for (i = 0; i < objects.length; i++) {
    if (origin != objects[i]) {
      if (edgeDist(pos, objects[i]) < minDist) {
        minDist = edgeDist(pos, objects[i]);
        var index = i;
      }
    }
  }
  return index;
}

function hit(hitList) {
  hitList.forEach((element) => {
    element.color = "white";
  });
  objects.forEach((element) => {
    if (hitList.includes(element) === false) {
      element.color = "white";
    }
  });
}

document.body.addEventListener("keydown", function (e) {
  keys[e.key] = true;
});
document.body.addEventListener("keyup", function (e) {
  keys[e.key] = false;
});

function moveCharacter(Object, friction) {
  if (keys["w"]) {
    if (Object.velocity.y > -Object.speed) {
      Object.velocity.y--;
    }
  }
  if (keys["a"]) {
    if (Object.velocity.x > -Object.speed) {
      Object.velocity.x--;
    }
  }
  if (keys["s"]) {
    if (Object.velocity.y < Object.speed) {
      Object.velocity.y++;
    }
  }
  if (keys["d"]) {
    if (Object.velocity.x < Object.speed) {
      Object.velocity.x++;
    }
  }

  Player, Object.pos.x, Object.pos.y + Object.velocity.y;

  {
    Object.pos.y += Object.velocity.y;
  }

  Player, Object.pos.x + Object.velocity.x, Object.pos.y;

  {
    Object.pos.x += Object.velocity.x;
  }
  Object.velocity.x *= friction;
  Object.velocity.y *= friction;
}

// Canvas 2

let walls = [];

class line2 {
  constructor(x, y, length, thickness, color) {
    this.a = { x: x, y: y - length / 2 };
    this.b = { x: x, y: y + length / 2 };
    this.thickness = thickness;
    this.color = color;
    walls.push(this);
  }
  show() {
    ctx2.strokeStyle = `rgb(${this.color},${this.color},${this.color} )`;
    ctx2.lineWidth = this.thickness;
    ctx2.beginPath();
    ctx2.moveTo(this.a.x, this.a.y);
    ctx2.lineTo(this.b.x, this.b.y);
    ctx2.stroke();
  }
}

function update() {
  requestAnimationFrame(update);

  moveCharacter(Player, 0.95);
  walls = [];
  hitList = [];
  rayCircles = [];
  hitList = [];
  rayLines = [];

  degrees = Dir(Player.pos, mousePos) - Math.PI / 3;
  while (degrees < Dir(Player.pos, mousePos) + Math.PI / 3) {
    march(Player, degrees);
    degrees += Math.PI / 6 / 70;
  }
  hit(hitList);

  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();

  ctx2.beginPath();
  ctx2.rect(0, 0, canvas.width, canvas.height);
  ctx2.fillStyle = "black";
  ctx2.fill();
  ctx2.stroke();

  hitList.forEach((Object) => {
    new rayCircle(Object.pos.x, Object.pos.y, 10);

    let direction = Dir(Player.pos, Object.pos) - Dir(Player.pos, mousePos);
    // console.log(direction);
    let size = dist(Player.pos, Object.pos) - 500;
    let color = dist(Player.pos, Object.pos);
    new line2(
      direction * canvas2.width + 400,
      canvas.height / 2,
      size,
      10,
      300 - color
    );
  });

  walls.forEach((element) => {
    element.show();
  });

  for (var i = 0; i < objects.length; i++) {
    objects[i].show();
  }
  for (var i = 0; i < rayCircles.length; i++) {
    rayCircles[i].show();
  }
  for (var i = 0; i < rayLines.length; i++) {
    rayLines[i].show();
  }
}

update();
