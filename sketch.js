var logoJSON;
var snapDistance, snapStrength, snapX, snapY, increment;
var textToRender = "p5*js";
var opFont;

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

  background(255); //#ed225d, 237, 34, 93

  fill(237, 34, 93);
  drawSVG(logoJSON);
}

function draw() {
  if( mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0 )
  {
    if(snapDistance == 1)
      snapDistance = int(random(14.5, 22.5));
    if(pmouseX < mouseX){
      increment = -1;
    }
    else if(pmouseX > mouseX){
      increment = 1;
    }
  }
  else{
    if( snapDistance > 3){
        snapDistance -= 3;
    }
    else{
      snapDistance = 1;
    }
  }

  snapX += increment;

  // doSnap(path, snapDistance, snapX, snapY);
  // path.draw(this.drawingContext);
}

function drawSVG(data)
{
  for(var i=0; i<data.length; i++)
  {
    drawSVGPath(data[i]);
  }
}

function drawSVGPath(data)
{
  var curX, curY, ctrX, ctrY;
  var clipStart = false;
  for( var i=0; i<data.length; i++ ){
    var one = data[i];
    switch (one.code) {
      case 'M':
        if(i == 0){
          beginShape();
        }
        curX = one.x;
        curY = one.y;
        vertex(curX, curY);
        break;
      case 'l':
        curX += one.x;
        curY += one.y;
        vertex(curX, curY);
        break;
      case 'L':
        curX = one.x;
        curY = one.y;
        vertex(curX, curY);
        break;
      case 'v':
        curY += one.y;
        vertex(curX, curY);
        break;
      case 'V':
        curY = one.y;
        vertex(curX, curY);
        break;
      case 'h':
        curX += one.x;
        vertex(curX, curY);
        break;
      case 'H':
        curX = one.x;
        vertex(curX, curY);
        break;
      case 'c':
        ctrX = curX+one.x2;
        ctrY = curY+one.y2;
        bezierVertex(curX+one.x1, curY+one.y1, curX+one.x2, curY+one.y2, curX+=one.x, curY+=one.y);
        break;
      case 'C':
        bezierVertex(one.x1, one.y1, ctrX=one.x2, ctrY=one.y2, curX=one.x, curY=one.y);
        break;
      case 's':
        bezierVertex(curX*2-ctrX, curY*2-ctrY, ctrX=curX+one.x2, ctrY=curY+one.y2, curX+=one.x, curY+=one.y);
        break;
      case 'Z':
        if( i != data.length-1 ){
          beginContour();
          clipStart = true;
        }
        else{
          if(clipStart){
            endContour();
          }
          endShape(CLOSE);
        }
        break;
      default:
        print(one.code);
    }
  }
}

function doSnap(path, value, x, y) {
  var i;
  var strength = snapStrength / 100.0;
  for (i = 0; i < path.commands.length; i++) {
    var cmd = path.commands[i];
    if (cmd.type !== 'Z') {
      cmd.x = snap(cmd.x + x, value, strength) - x;
      cmd.y = snap(cmd.y + y, value, strength) - y;
    }
    if (cmd.type === 'Q' || cmd.type === 'C') {
      cmd.x1 = snap(cmd.x1 + x, value, strength) - x;
      cmd.y1 = snap(cmd.y1 + y, value, strength) - y;
    }
    if (cmd.type === 'C') {
      cmd.x2 = snap(cmd.x2 + x, value, strength) - x;
      cmd.y2 = snap(cmd.y2 + y, value, strength) - y;
    }
  }
}


// Round a value to the nearest "step".
function snap(v, distance, strength) {
  return (v * (1.0 - strength)) + (strength * Math.round(v / distance) * distance);
}
