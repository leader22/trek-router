import assert from "power-assert";
import api from "../fixtures/parse-api.js";
import { Router } from "../index.mjs";
import { createFunc, shuffle, camelCase, printTree } from "./utils.js";

describe("Parse API", () => {
  let r;

  beforeEach(() => {
    r = new Router();
    shuffle(api).forEach((i) => {
      let [method, path] = i;
      r.add(method, path, createFunc(camelCase("parse-api" + path)));
    });
  });

  it("Parse API routes", () => {
    printTree(r.tree, "", true);
  });

  shuffle(api).forEach((i) => {
    let [method, path, realpath] = i;
    it(path, () => {
      let [handler, params] = r.find(method, realpath);
      // console.log(path, realpath, handler, params)
      assert.notEqual(null, handler);
      assert.equal(camelCase("parse-api" + path), handler.name);
      assert.equal((path.match(/\:/g) || []).length, params.length);
    });
  });
});
