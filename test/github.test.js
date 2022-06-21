import assert from "power-assert";
import api from "../fixtures/github-api.js";
import { Router } from "../index.mjs";
import { createFunc, shuffle, camelCase, printTree } from "./utils.js";

const funcPrefix = "github-api";

describe("GitHub API", () => {
  let r;

  beforeEach(() => {
    r = new Router();
    shuffle(api).forEach((i) => {
      let [method, path] = i;
      r.add(method, path, createFunc(camelCase(funcPrefix + path)));
    });
  });

  it("GitHub API routes", () => {
    printTree(r.tree, "", true);
  });

  shuffle(api).forEach((i) => {
    let [method, path, realpath] = i;
    it(path, () => {
      let [handler, params] = r.find(method, realpath);
      // console.log(path, realpath, handler, params)
      assert.notEqual(null, handler);
      assert.equal(camelCase(funcPrefix + path), handler.name);
      assert.equal((path.match(/\:/g) || []).length, params.length);
    });
  });
});
