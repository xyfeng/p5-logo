var logoJSON, logoPaths;
var snapDistance, snapStrength, snapX, snapY, increment;

function preload() {
  logoJSON = loadJSON('p5js.json');
}

function setup() {
  createCanvas(250, 120);
  snapX = 0;
  snapY = 0;
  snapDistance = 1;
  snapStrength = 100;
  increment = 1;
  frameRate(30);
  noCursor();
  noStroke();
  fill(237, 34, 93);
  logoPaths = toAbsoluteSVG(logoJSON);

}

function draw() {
  clear();
  if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
    if (snapDistance == 1)
      snapDistance = int(random(14.5, 24.5));
    if (pmouseX < mouseX) {
      increment = -1;
    } else if (pmouseX > mouseX) {
      increment = 1;
    }
  } else {
    if (snapDistance > 3) {
      snapDistance -= 3;
    } else {
      snapDistance = 1;
    }
  }

  snapX += increment;
  var drawData = doSnap(logoPaths, snapDistance, snapX, snapY);
  drawSVG(drawData);
}

function doSnap(data, value, x, y) {
  var i, j, results = [];
  var strength = snapStrength / 100.0;
  for (i = 0; i < data.length; i++) {
    var path = [];
    for (j = 0; j < data[i].length; j++) {
      var command = {};
      var one = data[i][j];
      command.code = one.code;
      if (one.code !== 'Z') {
        command.x = snap(one.x + x, value, strength) - x;
        command.y = snap(one.y + y, value, strength) - y;
      }
      if (one.code === 'Q' || one.code === 'C') {
        command.x1 = snap(one.x1 + x, value, strength) - x;
        command.y1 = snap(one.y1 + y, value, strength) - y;
      }
      if (one.code === 'C') {
        command.x2 = snap(one.x2 + x, value, strength) - x;
        command.y2 = snap(one.y2 + y, value, strength) - y;
      }
      path.push(command);
    }
    results.push(path);
  }
  return results;
}

// Round a value to the nearest "step".
function snap(v, distance, strength) {
  return (v * (1.0 - strength)) + (strength * Math.round(v / distance) * distance);
}





/**
 *
 *
 *  Convert & Draw SVG based on preparsed JSON file
 *
 *
 */

function toAbsoluteSVG(data) {
  var results = [];
  for (var i = 0; i < data.length; i++) {
    var letter = [];
    var curX, curY, ctrX, ctrY;
    for (var j = 0; j < data[i].length; j++) {
      var command = {};
      var one = data[i][j];
      switch (one.code) {
        case 'M':
          command.code = 'M';
          command.x = curX = one.x;
          command.y = curY = one.y;
          break;
        case 'l':
          command.code = 'L';
          command.x = curX += one.x;
          command.y = curY += one.y;
          break;
        case 'L':
          command.code = 'L';
          command.x = curX = one.x;
          command.y = curY = one.y;
          break;
        case 'v':
          command.code = 'L';
          command.x = curX;
          command.y = curY += one.y;
          break;
        case 'V':
          command.code = 'L';
          command.x = curX;
          command.y = curY = one.y;
          break;
        case 'h':
          command.code = 'L';
          command.x = curX += one.x;
          command.y = curY;
          break;
        case 'H':
          command.code = 'L';
          command.x = curX = one.x;
          command.y = curY;
          break;
        case 'c':
          command.code = 'C';
          command.x1 = curX + one.x1;
          command.y1 = curY + one.y1;
          command.x2 = ctrX = curX + one.x2;
          command.y2 = ctrY = curY + one.y2;
          command.x = curX += one.x;
          command.y = curY += one.y;
          break;
        case 'C':
          command.code = 'C';
          command.x1 = one.x1;
          command.y1 = one.y1;
          command.x2 = ctrX = one.x2;
          command.y2 = ctrY = one.y2;
          command.x = curX = one.x;
          command.y = curY = one.y;
          break;
        case 's':
          command.code = 'C';
          command.x1 = curX * 2 - ctrX;
          command.y1 = curY * 2 - ctrY;
          command.x2 = ctrX = curX + one.x2;
          command.y2 = ctrY = curY + one.y2;
          command.x = curX += one.x;
          command.y = curY += one.y;
          break;
        case 'Z':
          command.code = 'Z';
          break;
        default:
          print(one.code);
      }
      letter.push(command);
    }
    results.push(letter);
  }
  return results;
}

function drawSVG(data) {
  for (var i = 0; i < data.length; i++) {
    var clipStart = false;
    for (var j = 0; j < data[i].length; j++) {
      var one = data[i][j];
      switch (one.code) {
        case 'M':
          if (j == 0) {
            beginShape();
          }
          vertex(one.x, one.y);
          break;
        case 'L':
          vertex(one.x, one.y);
          break;
        case 'C':
          bezierVertex(one.x1, one.y1, one.x2, one.y2, one.x, one.y);
          break;
        case 'Z':
          if (j != data[i].length - 1) {
            beginContour();
            clipStart = true;
          } else {
            if (clipStart) {
              endContour();
            }
            endShape(CLOSE);
          }
          break;
        default:
          break;
      }
    }
  }
}
