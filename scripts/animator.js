import { interpolate, separate, splitPathString } from "https://esm.sh/flubber@0.4.2";
import TextToSVG from 'https://esm.sh/@naari3/text-to-svg@3.3.1';
import {
  CssColorParser,
  CssColorParserPlus,
} from "https://esm.sh/css-color-parser-h@3.0.2";
await import(
  "https://cdn.jsdelivr.net/gh/Kaiido/path2D-inspection@master/build/path2D-inspection.min.js"
);
Path2D.prototype.getTotalLength = function getTotalLength() {
  let p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", this.toSVGString());
  return p.getTotalLength();
};

export function animator(props) {
  const name = props.name || "";
  const scenes = props.scenes || [];
  const parentElement = props.parentElement || document.body;
  const canvas = document.createElement("canvas");
  // canvas.style.width = "100%";
  // canvas.style.height = "100%";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  parentElement.appendChild(canvas);
  const anim = new Scene(canvas, scenes[0]);
}

export default animator;

export class Scene {
  constructor(canvas, scene) {
    this.finished = false;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.components = [];
    this.scene = scene(this);
    this.render = this.render.bind(this);
    this.time = performance.now();
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    requestAnimationFrame(this.render);
  }
  canFinish() {
    this.finished = true;
  }
  *wait(time=1000) {
    yield* new Wait().wait(time);
  }
  add(component) {
    this.components.push(component);
  }
  background(color) {
    this.components.push(new Background({ color: color }));
  }
  *all(...tasks) {
    while (Object.keys(tasks).length !== 0) {
      tasks = tasks.filter((task) => !task.next().done);
      yield;
    }
  }
  *tween(start, end, cb, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      cb(util.lerp(start, end, a));
      yield;
    }
    if (t >= 1) {
      cb(end);
    }
  }
  render(time) {
    this.canvas.width = window.innerWidth;
    // this.canvas.width = 500;
    this.canvas.height = window.innerHeight;
    // this.canvas.height = 500;
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.time = time;
    this.scene.next(this);

    for (let component of this.components) {
      component._renderBase(this.ctx, 1, this.canvas);
    }

    this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    if (!this.finished) {
      // this.components = [];
      this.lastTime = time;
      requestAnimationFrame(this.render);
    }
  }
}

export class Component {
  constructor(props) {
    this.children = [];
    this.visible = true;
    this.fill = "none";
    this.stroke = "none";
    this.strokeWeight = 0;
    for (let i in props) {
      this[i] = props[i];
    }
  }
  *fillTween(color, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    let startColor = this.fill;
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      let parsedNewColor = CssColorParserPlus.parseColor(color);
      let parsedColor =
        CssColorParserPlus.parseColor(
          startColor ||
            `rgba(${parsedNewColor.r}, ${parsedNewColor.g}, ${parsedNewColor.b}, 0)`
        ) ||
        CssColorParserPlus.parseColor(
          `rgba(${parsedNewColor.r}, ${parsedNewColor.g}, ${parsedNewColor.b}, 0)`
        );
      if (parsedColor)
        this.fill = `rgba(${util.lerp(
          parsedColor.r,
          parsedNewColor.r,
          a
        )}, ${util.lerp(parsedColor.g, parsedNewColor.g, a)}, ${util.lerp(
          parsedColor.b,
          parsedNewColor.b,
          a
        )}, ${util.lerp(parsedColor.a, parsedNewColor.a, a)})`;
      yield;
    }
    if (t >= 1) {
      this.fill = color;
    }
  }
  *strokeTween(color, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    let startColor = this.stroke;
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      let parsedNewColor = CssColorParserPlus.parseColor(color);
      let parsedColor =
        CssColorParserPlus.parseColor(
          startColor ||
            `rgba(${parsedNewColor.r}, ${parsedNewColor.g}, ${parsedNewColor.b}, 0)`
        ) ||
        CssColorParserPlus.parseColor(
          `rgba(${parsedNewColor.r}, ${parsedNewColor.g}, ${parsedNewColor.b}, 0)`
        );
      if (parsedColor)
        this.stroke = `rgba(${util.lerp(
          parsedColor.r,
          parsedNewColor.r,
          a
        )}, ${util.lerp(parsedColor.g, parsedNewColor.g, a)}, ${util.lerp(
          parsedColor.b,
          parsedNewColor.b,
          a
        )}, ${util.lerp(parsedColor.a, parsedNewColor.a, a)})`;
      yield;
    }
    if (t >= 1) {
      this.stroke = color;
    }
  }
  *strokeWeightTween(weight, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    let startWeight = this.strokeWeight;
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      this.strokeWeight = util.lerp(startWeight, weight, a);
    }
    if (t >= 1) {
      this.strokeWeight = weight;
    }
  }
  getChildren() {
    return this.children;
  }
  _renderBase(ctx, t, canvas) {
    if (this.visible) this.render(ctx, t, canvas);
    this.getChildren().forEach((child) => child._renderBase(ctx, t, canvas));
  }
}
export class Wait extends Component {
  constructor(props) {
    super(props);
  }
  *wait(time) {
    let t = 0;
    let startTime = performance.now();
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
    }
  }
  render(ctx, t, canvas) {}
}

export class Background extends Component {
  constructor(props) {
    super(props);
    this.fill = props.fill;
  }
  render(ctx, t, canvas) {
    let oldFill = ctx.fillStyle;
    ctx.fillStyle = this.fill;
    ctx.fillRect(
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );
    ctx.fillStyle = oldFill;
  }
}

export class SceneRoot extends Component {
  constructor(props) {
    super(props);
  }
}

export class Path extends Component {
  constructor(props) {
    super(props);
    this.offsetX = this.offsetX || 0;
    this.offsetY = this.offsetY || 0;
    this.x = this.x || 0;
    this.y = this.y || 0;
    this.fill = this.fill || "none";
    this.stroke = this.stroke || "none";
    this.strokeWeight = this.strokeWeight || 3;
    this.p = this.p || "";
    this.drawInAmount = typeof this.drawInAmount === 'number' ? this.drawInAmount : 1;
    this.isCircle = false;
  }
  *drawIn(amount, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    let startAmount = this.drawInAmount;
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      this.drawInAmount = util.lerp(startAmount, amount, a);
      yield;
    }
    if (t >= 1) {
      this.drawInAmount = amount;
    }
  }
  *size(w, h, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    let startWidth = this.width;
    let startHeight = this.height;
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      this.width = util.lerp(startWidth, w, a);
      this.height = util.lerp(startHeight, h || w, a);
      yield;
    }
    if (t >= 1) {
      this.width = w;
      this.height = h;
    }
  }
  *position(x, y, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    let startX = this.x;
    let startY = this.y;
    while (t < 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      this.x = util.lerp(startX, x, a);
      this.y = util.lerp(startY, y, a);
      yield;
    }
  }
  *path(to, time = 1000, timingFunction) {
    let t = 0;
    let startingPath = this.p;
    let interpolator = separate(startingPath, splitPathString(to), { maxSegmentLength: 2, single: true });
    let startTime = performance.now();
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      this.p = interpolator(a);
      yield;
    }
    if (t > 1) {
      this.p = to;
      this.isCircle = false;
      yield;
    }
  }
  *offset(x, y, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    let startX = this.offsetX;
    let startY = this.offsetY;
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      this.offsetX = util.lerp(startX, x, a);
      this.offsetY = util.lerp(startY, y, a);
      yield;
    }
  }
  *to(path, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    // let startPathData = this.p;
    // let startOffsetX = this.offsetX;
    // let startOffsetY = this.offsetY;
    // let startX = this.x;
    // let startY = this.y;
    // let startFill = this.fill;
    // let startStroke = this.stroke;
    // let startStrokeWeight = this.strokeWeight;
    // let startDrawInAmount = this.drawInAmount;
    function* all(...tasks) {
      while (Object.keys(tasks).length !== 0) {
        tasks = tasks.filter((task) => !task.next().done);
        yield;
      }
    }
    yield* all(this.path(path.p, time, timingFunction), this.offset(path.offsetX, path.offsetY, time, timingFunction), this.position(path.x, path.y, time, timingFunction), this.fillTween(path.fill, time, timingFunction), this.strokeTween(path.stroke, time, timingFunction), /*this.strokeWeightTween(path.strokeWeight, time, timingFunction),*/ this.drawIn(path.drawInAmount, time, timingFunction));
    // while (t <= 1) {
    //   t = (performance.now() - startTime) / time;
    //   let a = (timingFunction || util.easeInOutCubic)(t);
    //   this.offsetX = util.lerp(startX, x, a);
    //   this.offsetY = util.lerp(startY, y, a);
    //   yield;
    // }
  }
  render(ctx, t, canvas) {
    const path = new Path2D(this.p);
    // if (!this.isCircle) {
      // let width = path.getBBox().width;
      // let height = path.getBBox().height;
      // ctx.scale(1 / width, 1 / height);
      // ctx.scale(this.width, this.height);
      ctx.lineWidth = this.strokeWeight;
        // (2 / Math.max(this.width / width, this.height / height)) *
      ctx.translate(
        this.offsetX + this.x,
        this.offsetY + this.y
      );
      // ctx.scale(this.width / width, this.height / height);
    // }
    let oldFill = 'transparent';
    let oldStroke = ctx.strokeStyle;
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.stroke;
    let pathDrawer = util.drawPercentageOfPath(path, ctx, this.drawInAmount);
    pathDrawer.next();
    ctx.fill(path);
    ctx.stroke(path);
    pathDrawer.next();
    ctx.translate(
      -this.offsetX - this.x,
      -this.offsetY - this.y
    );
    // if (!this.isCircle) {
    //   ctx.scale(1, 1);
    //   ctx.translate(
    //     width / 2 - this.offsetX - this.x,
    //     height / 2 - this.offsetY - this.y
    //   );
    // }
    ctx.fillStyle = oldFill;
    ctx.strokeStyle = oldStroke;
  }
}
// export class Circle extends Path {
//   constructor(props) {
//     super(props);
//     this.isCircle = true;
//     // this.p = `M-${this.width},0a${this.width},${this.height} 0 1,0 ${this.width*2},0a${this.width},${this.height} 0 1,0 -${this.width*2},0`;
//     this.p = this.generateCircle(0, 0, this.width, this.height);
//     // this.p = `M-${this.width / 2},${this.height/2}a${this.width},${this.height} 0 1,0 ${this.width * 2},0a${this.width},${this.height} 0 1,0 -${this.width*2},0`
//   }
//   generateCircle(cx, cy, rx, ry) {
//     let output = "M" + (cx - rx).toString() + "," + cy.toString();
//     output +=
//       "a" +
//       rx.toString() +
//       "," +
//       ry.toString() +
//       " 0 1,0 " +
//       (2 * rx).toString() +
//       ",0";
//     output +=
//       "a" +
//       rx.toString() +
//       "," +
//       ry.toString() +
//       " 0 1,0 " +
//       (-2 * rx).toString() +
//       ",0";
//     // form.output.value = output;
//     return output;
//   }
// }
export class Circle extends Path {
  constructor(props) {
    super(props);
    this.isCircle = true;
    let path = new Path2D();
    path.ellipse(this.x || 0, this.y || 0, this.width / 2, this.height/2, 0, 0, Math.PI * 2);
    this.p = path.toSVGString();
  }
  render(ctx, t, canvas) {
    const path = new Path2D(this.p);
    // path.ellipse((this.x || 0) + this.width/4, (this.y || 0) + this.height/4, (this.width/2) || 50, (this.height/2) || 50, 0, 0, Math.PI * 2);
    // path.arc(this.x || 0, this.y || 0, this.width / 2, 0, Math.PI * 2);
    // console.log(path.getPathData());
    ctx.lineWidth = this.strokeWeight;
    let oldFill = 'transparent';
    let oldStroke = ctx.strokeStyle;
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.stroke;
    ctx.translate(
      this.offsetX + this.x,
      this.offsetY + this.y
    );
    let pathDrawer = util.drawPercentageOfPath(path, ctx, this.drawInAmount);
    pathDrawer.next();
    ctx.fill(path);
    ctx.stroke(path);
    pathDrawer.next();
    ctx.translate(
      -this.offsetX - this.x,
      -this.offsetY - this.y
    );
    ctx.fillStyle = oldFill;
    ctx.strokeStyle = oldStroke;
  }
}

export class Text extends Path {
  constructor(props) {
    super(props);
    this.font = this.font || "./notosans.otf";
    // this.isCircle = true;
    // let p = "";
    // this.isCircle = true;
    // TextToSVG.loadSync();
    let p = this;
    TextToSVG.load(this.font, function(err, textToSVG) {
      if (err) throw err;
      p.p = textToSVG.getD(props.text || '');
    });
    // path.ellipse(this.x || 0, this.y || 0, this.width / 2, this.height/2, 0, 0, Math.PI * 2);
    // this.p = p;
  }
  render(ctx, t, canvas) {
    const path = new Path2D(this.p);
    // path.ellipse((this.x || 0) + this.width/4, (this.y || 0) + this.height/4, (this.width/2) || 50, (this.height/2) || 50, 0, 0, Math.PI * 2);
    // path.arc(this.x || 0, this.y || 0, this.width / 2, 0, Math.PI * 2);
    // console.log(path.getPathData());
    ctx.lineWidth = this.strokeWeight;
    let oldFill = 'transparent';
    let oldStroke = ctx.strokeStyle;
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.stroke;
    ctx.translate(
      this.offsetX + this.x,
      this.offsetY + this.y
    );
    let pathDrawer = util.drawPercentageOfPath(path, ctx, this.drawInAmount);
    pathDrawer.next();
    ctx.fill(path);
    ctx.stroke(path);
    pathDrawer.next();
    ctx.translate(
      -this.offsetX - this.x,
      -this.offsetY - this.y
    );
    ctx.fillStyle = oldFill;
    ctx.strokeStyle = oldStroke;
  }
}

// export class Circle extends Component {
//   constructor(props) {
//     super(props);
//     this.offsetX = this.offsetX || 0;
//     this.offsetY = this.offsetY || 0;
//     this.x = this.x || 0;
//     this.y = this.y || 0;
//     this.fill = this.fill || "none";
//     this.stroke = this.stroke || "none";
//     this.strokeWeight = this.strokeWeight || 3;
//   }
//   *size(w, h, time = 1000, timingFunction) {
//     let t = 0;
//     let startTime = performance.now();
//     let startWidth = this.width;
//     let startHeight = this.height;
//     while (t <= 1) {
//       t = (performance.now() - startTime) / time;
//       let a = (timingFunction || util.easeInOutCubic)(t);
//       this.width = util.lerp(startWidth, w, a);
//       this.height = util.lerp(startHeight, h || w, a);
//       yield;
//     }
//   }
//   *position(x, y, time = 1000, timingFunction) {
//     let t = 0;
//     let startTime = performance.now();
//     let startX = this.x;
//     let startY = this.y;
//     while (t <= 1) {
//       t = (performance.now() - startTime) / time;
//       let a = (timingFunction || util.easeInOutCubic)(t);
//       this.x = util.lerp(startX, x, a);
//       this.y = util.lerp(startY, y, a);
//       yield;
//     }
//   }
//   *offset(x, y, time = 1000, timingFunction) {
//     let t = 0;
//     let startTime = performance.now();
//     let startX = this.offsetX;
//     let startY = this.offsetY;
//     while (t <= 1) {
//       t = (performance.now() - startTime) / time;
//       let a = (timingFunction || util.easeInOutCubic)(t);
//       this.offsetX = util.lerp(startX, x, a);
//       this.offsetY = util.lerp(startY, y, a);
//       yield;
//     }
//   }
//   render(ctx, t, canvas) {
//     ctx.beginPath();
//     ctx.ellipse(
//       (this.x || 0) + (this.offsetX || 0),
//       (this.y || 0) + (this.offsetY || 0),
//       Math.abs(this.width / 2),
//       Math.abs(this.height / 2),
//       0,
//       0,
//       360
//     );
//     ctx.fillStyle = this.fill;
//     ctx.fill();
//     ctx.strokeStyle = this.stroke;
//     ctx.lineWidth = this.strokeWeight;
//     ctx.stroke();
//   }
// }
export class Rect extends Component {
  constructor(props) {
    super(props);
    this.x = this.x || 0;
    this.y = this.y || 0;
    this.offsetX = this.offsetX || 0;
    this.offsetY = this.offsetY || 0;
    this.width = this.width || 0;
    this.height = this.height || 0;
    this.fill = this.fill || "none";
    this.stroke = this.stroke || "none";
    this.strokeWeight = this.strokeWeight || 3;
  }
  *position(x, y, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      this.x = util.lerp(this.x, x, a);
      this.y = util.lerp(this.y, y, a);
      yield;
    }
  }
  *offset(x, y, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      this.offsetX = util.lerp(this.offsetX, x, a);
      this.offsetY = util.lerp(this.offsetY, y, a);
      yield;
    }
  }
  *size(w, h, time = 1000, timingFunction) {
    let t = 0;
    let startTime = performance.now();
    while (t <= 1) {
      t = (performance.now() - startTime) / time;
      let a = (timingFunction || util.easeInOutCubic)(t);
      this.width = util.lerp(this.width, w, a);
      this.height = util.lerp(this.height, h || w, a);
      yield;
    }
  }
  render(ctx, t, canvas) {
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.strokeWeight;
    ctx.fillRect(
      this.x - this.width / 2 + this.offsetX,
      this.y - this.height / 2 + this.offsetY,
      this.width,
      this.height
    );
    ctx.strokeRect(
      this.x - this.width / 2 + this.offsetX,
      this.y - this.height / 2 + this.offsetY,
      this.width,
      this.height
    );
  }
}
export class Container extends Component {
  constructor(props) {
    super(props);
  }
}
export function xml(strings, ...values) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (values[i] || "");
  });
  return util.xmlStringToScene(str);
}

export const util = {
  drawPercentageOfPath: function* (path, ctx, t) {
    let split = splitPathString(path.toSVGString());
    let l = 0;
    split.forEach(v => {let length = (new Path2D(v)).getTotalLength(); l = length > l ? length : l});
    ctx.setLineDash([l, l]);
    ctx.lineDashOffset = (1 - t) * (l);
    yield;
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    yield;
  },
  xmlStringToScene: function (sceneString) {
    const domParser = new DOMParser();
    const parsed = domParser.parseFromString(sceneString, "text/xml");
    function elementToClasses(element) {
      if (!element.hasChildNodes()) {
        let props = {};
        for (let i = 0; i < element.attributes.length; i++) {
          props[element.attributes[i].nodeName] = element.getAttribute(
            element.attributes[i].nodeName
          );
        }
        props["children"] = [];
        return new (util.components.filter(
          (v) => v.name === element.tagName
        )[0] || Component)(props);
      } else {
        let props = {};
        for (let i = 0; i < element.attributes.length; i++) {
          props[element.attributes[i].nodeName] = element.getAttribute(
            element.attributes[i].nodeName
          );
        }
        props["children"] = [...element.children].map((v) =>
          elementToClasses(v)
        );
        return new (util.components.filter(
          (v) => v.name === element.tagName
        )[0] || Component)(props);
      }
    }
    return elementToClasses(parsed.documentElement);
  },
  importXML: async function (path) {
    let text = await (await fetch(path)).text();
    return util.xmlStringToScene(text);
  },
  components: [Component, SceneRoot, Circle, Rect, Container, Wait, Background],
  lerp: function (v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
  },
  easeInOutCubic: (x) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  easeInOutQuad: (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
};

export const COLORS = {
  RED: "#FF254E",
};
