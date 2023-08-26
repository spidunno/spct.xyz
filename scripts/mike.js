import { animator, xml, Background, Circle, Path, Rect, COLORS} from "./animator.js";
let p = `M129.857 132.052H132.857V129.052V12.6558V9.65584H129.857H112.066H110.162L109.351 11.3786L71.3134 92.2228L71.3106 92.2287C70.389 94.1985 69.2964 96.7602 68.0348 99.903C67.141 97.7281 66.0624 95.2806 64.8073 92.5689C64.8066 92.5674 64.806 92.566 64.8053 92.5645L27.5335 11.4038L26.7307 9.65584H24.8072H6H3V12.6558V129.052V132.052H6H19.7242H22.7242V129.052V51.1299C22.7242 49.581 22.7194 48.0931 22.7096 46.6664L61.7362 130.32L62.544 132.052H64.4549H71.4017H73.3167L74.1229 130.315L112.756 47.0687C112.725 48.4215 112.709 49.7212 112.709 50.9675V129.052V132.052H115.709H129.857ZM173.91 132.052H176.91V129.052V45.9351V42.9351H173.91H160.016H157.016V45.9351V129.052V132.052H160.016H173.91ZM274.045 132.052H281.33L276.158 126.922L234.925 86.0275L273.028 48.0602L278.172 42.9351H270.911H252.697H251.415L250.529 43.8609L218.929 76.8831V6V3H215.929H202.036H199.036V6V129.052V132.052H202.036H215.929H218.929V129.052V96.2268L252.395 131.128L253.281 132.052H254.56H274.045ZM358 93.8214H361V90.8214V83.8409C361 70.8558 357.768 60.2961 350.93 52.5531C344.029 44.7397 334.35 40.987 322.334 40.987C310.166 40.987 299.854 45.4062 291.599 54.1887L291.598 54.1895C283.367 62.9519 279.348 74.2539 279.348 87.8182C279.348 102.011 282.985 113.463 290.65 121.754L290.657 121.762C298.336 130.01 308.826 134 321.741 134C334.681 134 345.422 131.264 353.698 125.508L354.985 124.613V123.045V110.545V104.53L350.18 108.149C342.483 113.947 334.131 116.799 325.045 116.799C316.953 116.799 310.96 114.478 306.678 110.142C302.914 106.331 300.579 100.986 299.924 93.8214H358ZM335.676 63.5891L335.683 63.5973L335.69 63.6056C338.429 66.6541 340.155 70.882 340.633 76.539H300.565C301.84 71.452 304.168 67.3293 307.492 64.0661C311.493 60.1388 316.295 58.1883 322.08 58.1883C328.174 58.1883 332.568 60.0785 335.676 63.5891ZM158.739 24.596C161.069 26.7564 163.925 27.8312 167.132 27.8312C170.398 27.8312 173.293 26.7271 175.629 24.498C178.012 22.2781 179.282 19.468 179.282 16.2273C179.282 12.9267 178.046 10.0629 175.611 7.85901C173.279 5.64086 170.39 4.54221 167.132 4.54221C163.903 4.54221 161.042 5.65948 158.72 7.87569C156.341 10.0911 155.152 12.9517 155.152 16.2273C155.152 19.5113 156.347 22.3782 158.739 24.596Z`;
animator({
  name: "myAnimator",
  scenes: [myScene],
  parentElement: document.body,
});
let thing = 55.25;
let thing2 = 31.75;
let thing3 = (700 / 2) - thing * 3;
function* myScene(scene) {
  // let bg = new Background({ fill: "#121212" });
  let bg = new Background({ fill: "#101010" });
  let circle1 = new Circle({width: 100, height: 100, drawInAmount: 0, fill: "transparent", stroke: "#ffffff", strokeWeight: 2});
  let circle2 = new Circle({width: 100, height: 100, drawInAmount: 0, fill: "transparent", stroke: "#ffffff", strokeWeight: 2});
  let circle3 = new Circle({width: 100, height: 100, drawInAmount: 0, fill: "transparent", stroke: "#ffffff", strokeWeight: 2});
  let circle4 = new Circle({width: 100, height: 100, drawInAmount: 0, fill: "transparent", stroke: "#ffffff", strokeWeight: 2});
  let path1 = new Path({fill: "transparent", stroke: "#ffffff", drawInAmount: 0, strokeWeight: 2, p})
  // let path = new Path({fill: "#00ff0050", stroke: "#00ff00", strokeWeight: 3, width: 100, height: 100, p: "M100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50Z"});
  scene.add(bg);
  path1.offsetX = thing2 + (thing * 2) - thing3;
  path1.offsetY = -138.01/2;
  // yield;
  // yield* scene.wait(2000);
  scene.add(path1);
  scene.add(circle1);
  yield;
  // yield* path1.drawIn(1, 2500);
  yield* circle1.drawIn(1, 1000);
  // yield* path1.fillTween('#25ff2550', 500);
  // yield* circle1.size(100, 100, 500);
  // console.log(circle1.p);
  // yield* circle1.path('M-90.0489 8.95177L-23.3442 0.250008C-15.9971 27.4188 -0.664664 82.8007 1.88751 86.9775C5.07774 92.1986 84.5433 115.693 104.845 75.0851C125.146 34.4769 82.5131 -5.55117 66.562 -4.68099C50.6109 -3.81081 259.715 -149.71 192.721 16.7834C125.726 183.277 194.171 175.155 203.452 144.409C212.732 113.663 -23.0542 153.111 -30.0147 156.302C-35.5831 158.854 -82.9917 111.149 -106 86.9775L-90.0489 8.95177Z', Number.MIN_VALUE);
  // yield* circle1.drawIn(1, 1000);
  // yield* circle1.fillTween("#FF254E30", 1000);
  // yield* circle1.path('M125 -3.061616997868383e-14A125 125 0 0 1 -125 4.5924254968025744e-14A125 125 0 0 1 125 -6.123233995736766e-14', 1000);
  scene.add(circle2);
  yield;
  yield* scene.all(circle1.offset(-thing, 0, 500), circle2.drawIn(1, 500), circle2.offset(thing, 0, 500), circle1.fillTween(circle1.stroke + '50', 500));
  scene.add(circle3);
  yield;
  yield* scene.all(circle1.offset(-thing, -thing, 500), circle2.offset(thing, -thing, 500), circle3.drawIn(1, 500), circle3.offset(-thing, thing, 500), circle2.fillTween(circle2.stroke + '50', 500));

  scene.add(circle4);
  yield* scene.all(circle4.offset(thing, thing, 500), circle4.drawIn(1, 500), circle3.fillTween(circle3.stroke + '50', 500));
  yield* circle4.fillTween(circle4.stroke + '50', 500);
  yield* scene.all(circle1.strokeTween('#ffffff00', 500), circle2.strokeTween('#ffffff00', 500), circle3.strokeTween('#ffffff00', 500), circle4.strokeTween('#ffffff00', 500), circle1.path('M-50 -50H50V50H-50V-50Z', 500), circle2.path('M-50 -50H50V50H-50V-50Z', 500), circle3.path('M-50 -50H50V50H-50V-50Z', 500), circle4.path('M-50 -50H50V50H-50V-50Z', 500), circle1.fillTween('#F35220', 500), circle2.fillTween('#82BD01', 500), circle3.fillTween('#00A7F0', 500), circle4.fillTween('#FFBB02', 500), circle1.position(-thing2 - thing3, 0, 500), circle2.position(-thing2 - thing3, 0, 500), circle3.position(-thing2 - thing3, 0, 500), circle4.position(-thing2 - thing3, 0, 500));
  yield* path1.drawIn(0.4, 1000);
  yield* scene.all(path1.strokeTween('#ffffff00', 500), path1.fillTween('#ffffff', 500));
  // yield* circle.path("M486.5 1.5L255.5 79.5L438 76L264 152.5L1 39.5L20 199L99.5 172L47.5 297L307 283L4thing 222.5L486.5 1.5Z", 500);
  // yield* scene.wait(1000);
  // yield* circle.path("M0 0H100V100H0V0Z", 500);
  // scene.add(path);
  // yield;
  // yield* scene.wait(500);
  // yield* path.path("M0 0H100V100H0V0Z", 500);
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function lerp(v0, v1, t) {
  return v0*(1-t)+v1*t
}