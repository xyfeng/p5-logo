var font;
var snapDistance, snapStrength, snapX, snapY, increment;
var textToRender = "p5*js";
var opFont;

function preload() {
  font = loadFont('font/font.otf');
}

function setup() {
  createCanvas(240, 120);
  opFont = font.font;
  snapX = 0;
  snapY = 0;
  snapDistance = 1;
  snapStrength = 100;
  increment = 1;
  frameRate(30);
  noCursor();
}

function draw() {
  background(255); //#ed225d, 237, 34, 93

  var path = opFont.getPath(textToRender, 20, 80, 80, {
    kerning: true
  });
  path.fill = "#ed225d";

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

  doSnap(path, snapDistance, snapX, snapY);
  path.draw(this.drawingContext);
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
