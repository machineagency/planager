{
  "displayName": "P5 Sketch Editor",
  "inports": {},
  "outports": {
    "sketch": {
      "displayName": "sketch",
      "description": "A P5.js sketch"
    }
  },
  "state": {
    "sketch": "function setup() {\n  createCanvas(710, 400);\n  background(102);\n}\n\nfunction draw() {\n  variableEllipse(mouseX, mouseY, pmouseX, pmouseY);\n}\n\nfunction variableEllipse(x, y, px, py) {\n  let speed = abs(x - px) + abs(y - py);\n  stroke(speed);\n  ellipse(x, y, speed, speed);\n}\n"
  }
}