import _ from "lodash";
import assert from "power-assert";
import api from "../fixtures/parse-api.js";
import { Router } from "../index.js";
import { printTree } from "./node.js";

function createFunc(name) {
  var a = `(function ${name || ""}(){})`;
  return eval(a);
}

describe("Parse API", () => {
  let r;

  beforeEach(() => {
    r = new Router();
    _.shuffle(api).forEach((i) => {
      let [method, path] = i;
      r.add(method, path, createFunc(_.camelCase("parse-api" + path)));
    });
  });

  it("Parse API routes", () => {
    printTree(r.tree, "", true);
  });

  _.shuffle(api).forEach((i) => {
    let [method, path, realpath] = i;
    it(path, () => {
      let [handler, params] = r.find(method, realpath);
      // console.log(path, realpath, handler, params)
      assert.notEqual(null, handler);
      assert.equal(_.camelCase("parse-api" + path), handler.name);
      assert.equal((path.match(/\:/g) || []).length, params.length);
    });
  });
});
