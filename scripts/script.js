const canvas = document.getElementById("star-canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext("2d");
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let mouseUp = true;
let delta = 0;
let lastTime = 0;
let stars = Array(3200)
  .fill(0)
  .map((v) => {
    let x = Math.random() * 4 - 2;
    let y = Math.random() * 4 - 2;
    return [x, y, x, y, Math.random() + 1];
  });
document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});
document.addEventListener("mousedown", (event) => {
  mouseDown = true;
  mouseUp = false;
});
document.addEventListener("mouseup", (event) => {
  mouseUp = true;
  mouseDown = false;
});
lastTime = performance.now();
function render(time) {
  delta = time - lastTime;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  let mouseU = (mouseX / window.innerWidth) * 2 - 1;
  let mouseV = (mouseY / window.innerHeight) * 2 - 1;
  // console.log(mouseU, mouseV);
  // ctx.fillStyle = "#04000E";
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  // console.log(mouseDown, mouseUp);
  let mX = mouseX - canvas.width / 2;
  let mY = mouseY - canvas.height / 2;
  // console.log(mouseDown);
  // ctx.fillStyle = "black";
  // ctx.strokeStyle = '#101010';
  // ctx.beginPath();
  // ctx.ellipse(mX, mY, 32, 32, 0, 0, Math.PI * 2);
  // ctx.fill();
  // ctx.stroke();
  for (let i in stars) {
    let posX = stars[i][0] * (canvas.width / 2),
      posY = stars[i][1] * (canvas.height / 2);
    let nx = stars[i][2];
    let ny = stars[i][3];
    let distance = Math.hypot(mX - posX, mY - posY);
    let thingX = (mX - posX) / distance;
    let thingY = (mY - posY) / distance;
    let d = 38;
    // if (i == 0) console.log(thingX, thingY);
    // console.log()
    // if (distance <= 64) d = 64 - distance;
    // if (mouseDown) d = distance * 2;
    ctx.fillStyle = "#ffefff";
    ctx.strokeStyle = "none";
    ctx.beginPath();
    ctx.ellipse(
      posX - thingX * d,
      posY - thingY * d,
      stars[i][4],
      stars[i][4],
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    // ctx.fillRect(0, 0, 50, 50)
  }
  lastTime = performance.now();
  // mouseDown = false;
  // mouseUp = false;
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}
