const SKIND = 0;

type Handler<HandleFunc> = {
  handler?: HandleFunc;
  pnames?: string[];
};

export class Node {
  constructor(
    prefix = "/",
    children = [],
    kind = SKIND,
    map = Object.create(null)
  ) {
    this.label = prefix.charCodeAt(0);
    this.prefix = prefix;
    this.children = children;
    this.kind = kind;
    this.map = map;
  }

  addChild(n) {
    this.children.push(n);
  }

  findChild(c, t, l, e, i = 0) {
    for (l = this.children.length; i < l; i++) {
      e = this.children[i];
      if (c === e.label && t === e.kind) {
        return e;
      }
    }
  }

  findChildWithLabel(c, l, e, i = 0) {
    for (l = this.children.length; i < l; i++) {
      e = this.children[i];
      if (c === e.label) {
        return e;
      }
    }
  }

  findChildByKind(t, l, e, i = 0) {
    for (l = this.children.length; i < l; i++) {
      e = this.children[i];
      if (t === e.kind) {
        return e;
      }
    }
  }

  addHandler(method, handler, pnames) {
    this.map[method] = { handler, pnames };
  }

  findHandler(method) {
    return this.map[method];
  }
}
