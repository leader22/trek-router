const SKIND = 0;

type Handler<HandleFunc> = {
  handler?: HandleFunc;
  pnames?: string[];
};

export class Node<T> {
  label: number;
  prefix: string;
  children: Node<T>[];
  kind: number;
  map: Record<string, Handler<T>>;

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

  addChild(n: Node<T>) {
    this.children.push(n);
  }

  findChild(c: number, t: number) {
    const l = this.children.length;
    for (let i = 0; i < l; i++) {
      const e = this.children[i];
      if (c === e.label && t === e.kind) {
        return e;
      }
    }
  }

  findChildWithLabel(c: number) {
    const l = this.children.length;
    for (let i = 0; i < l; i++) {
      const e = this.children[i];
      if (c === e.label) {
        return e;
      }
    }
  }

  findChildByKind(t: number) {
    const l = this.children.length;
    for (let i = 0; i < l; i++) {
      const e = this.children[i];
      if (t === e.kind) {
        return e;
      }
    }
  }

  addHandler(
    method: string,
    handler?: Handler<T>["handler"],
    pnames?: Handler<T>["pnames"]
  ) {
    this.map[method] = { handler, pnames };
  }

  findHandler(method: string) {
    return this.map[method];
  }
}
