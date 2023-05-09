class Vector2 {
  constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
  }
  normalized() {
    let normalized = new Vector2();
    normalized.x = Math.cos(Math.atan(this._y / this._x));
    normalized.y = Math.sin(Math.atan(this._y / this._x));
    return normalized;
  }
  calc(char, vec2) {
    switch (char) {
      case "+":
        return new Vector2(this._x + vec2.x, this._y + vec2.y);
      case "-":
        return new Vector2(this._x - vec2.x, this._y - vec2.y);
      case "*":
        return new Vector2(this._x * vec2.x, this._y * vec2.y);
      case "/":
        return new Vector2(this._x / vec2.x, this._y / vec2.y);
      case "%":
        return new Vector2(this._x % vec2.x, this._y % vec2.y);
      case "^":
        return new Vector2(this._x ^ vec2.x, this._y ^ vec2.y);
      default:
        throw new Error("Invalid operator");
    }
  }
  set x(value) {
    this._x = value;
  }
  get x() {
    return this._x;
  }
  set y(value) {
    this._y = value;
  }
  get y() {
    return this._y;
  }
}

class GameLoopManager {
  constructor(func, cps, debug = false) {
    this.func = func;
    this.cps = cps;
    this.mpc = 1000 / this.cps;
    this.debug = debug;
    this.total_count = 0;
    this.total_time = 0;
  }
  start() {
    this.leastDelta = 0;
    this.start_time = Date.now();
    this.leastTime = Date.now();
    this.done();
  }

  done() {
    let now = Date.now();
    let deltaTime = now - this.leastTime;
    let delta = this.leastDelta - deltaTime;
    this.leastDelta = Math.max(0, this.mpc + delta);
    if (this.debug)
      console.log(
        deltaTime,
        "(",
        this.leastDelta,
        ")",
        this.total_time / this.total_count
      );
    setTimeout(() => {
      this.func();
      GameLoop.done();
    }, this.leastDelta);
    this.leastTime = now;

    this.total_count++;
    this.total_time += deltaTime;
  }

  refresh_total() {
    this.total_count = 1;
    this.total_time = this.leastDelta;
  }
}

class CanvasComponents {
  constructor({
    ctx = false,
    img = "assets/error.png",
    size = 50,
    position = new Vector2(0, 0),
    motion = new Vector2(0, 0),
    rotate = 0,
    rotation = 0,
    update = () => {},
  } = {}) {
    this.ctx = ctx ? ctx : undefined;
    this.image = new Image();
    this.image.src = img;
    this.size = size;
    this.position = position;
    this.motion = motion;
    this.rotate = rotate;
    this.rotation = rotation;
    this.update = update;
  }
  render() {
    let _X = this.position.x;
    let _Y = this.position.y;
    let phi = this.rotate * (Math.PI / 180);
    let X = _X * Math.cos(-phi) - _Y * Math.sin(-phi);
    let Y = _Y * Math.cos(-phi) + _X * Math.sin(-phi);
    this.ctx.rotate(phi);
    this.ctx.drawImage(
      this.image,
      X - this.size / 2,
      Y - this.size / 2,
      this.size,
      this.size
    );
    this.ctx.rotate(-phi);
  }
}

class CanvasManager {
  constructor(size, elem) {
    this.size = size;
    this.elem = elem;
    this.elem.width = this.size.x;
    this.elem.height = this.size.y;
    window.addEventListener("resize", () => {
      this.refresh();
    });
  }
  refresh() {
    if (
      this.ratio_mode !==
      window.innerHeight / window.innerWidth < this.size.y / this.size.x
    ) {
      let flag =
        window.innerHeight / window.innerWidth < this.size.y / this.size.x;
      this.elem.style.height = !flag
        ? `calc(100vw * ${this.size.y / this.size.x})`
        : "100%";
      this.elem.style.width = flag
        ? `calc(100vh * ${this.size.x / this.size.y})`
        : "100%";
    }
    this.ratio_mode =
      window.innerHeight / window.innerWidth < this.size.y / this.size.x;
  }
  get x() {
    return this.size.x;
  }
  get y() {
    return this.size.y;
  }
}

class keyInputManager {
  constructor() {
    this.key = {};
    window.addEventListener("keydown", (e) => {
      this.key[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.key[e.key] = false;
    });
  }
  IsPressed(key) {
    return this.key[key];
  }
}