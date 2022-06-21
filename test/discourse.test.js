import assert from "power-assert";
import api from "../fixtures/discourse-api.js";
import { Router } from "../index.mjs";
import { createFunc, shuffle, camelCase, printTree } from "./utils.js";

const funcPrefx = "discourse-api";

describe("Discourse API", () => {
  let r;

  beforeEach(() => {
    r = new Router();
    shuffle(api).forEach((i) => {
      let [method, path] = i;
      r.add(method, path, createFunc(camelCase(funcPrefx + path)));
    });
  });

  it("Discourse API routes", () => {
    printTree(r.tree, "", true);
  });

  shuffle(api).forEach((i) => {
    let [method, path, realpath] = i;
    it(path, () => {
      let [handler, params] = r.find(method, realpath);
      // console.log(path, realpath, handler, params)
      assert.notEqual(null, handler);
      assert.equal(camelCase(funcPrefx + path), handler.name);
      assert.equal((path.match(/\:|\*/g) || []).length, params.length);
    });
  });
});
