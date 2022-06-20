import { format } from "util";
import _ from "lodash";

const prefix = (tail, p, on, off) => format("%s%s", p, tail ? on : off);

export const printTree = (node, pfx, tail, method = "GET") => {
  let result = node.map[method];
  let handler = result && result.handler;
  let p = prefix(tail, pfx, "└── ", "├── ");
  console.log(
    "%s%s h=%s children=%s",
    p,
    node.prefix,
    handler ? handler.name : "",
    node.children.length
  );

  let nodes = node.children;
  let l = nodes.length;
  p = prefix(tail, pfx, "    ", "│   ");
  for (let i = 0; i < l - 1; ++i) {
    printTree(nodes[i], p, false);
  }
  if (l > 0) {
    printTree(nodes[l - 1], p, true);
  }
};

export const createFunc = (name) => eval(`(function ${name || ""}(){})`);

export const shuffle = _.shuffle;
export const camelCase = _.camelCase;
