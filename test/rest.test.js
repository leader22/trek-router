import assert from "power-assert";
import { Router } from "../index.mjs";
import { createFunc, shuffle, camelCase, printTree } from "./utils.js";

// https://github.com/labstack/echo/issues/479
const api = [
  ["GET", "/:piyo", "/piyo", "piyo"],
  ["POST", "/:hoge", "/hoge", "hoge"],
];

describe("Rest API", () => {
  let r;

  beforeEach(() => {
    r = new Router();
    shuffle(api).forEach((i) => {
      let [method, path] = i;
      r.add(
        method,
        path,
        createFunc(camelCase("rest-api" + path + "-" + method))
      );
    });
  });

  it("Parse API routes", () => {
    printTree(r.tree, "", true, "GET");
    printTree(r.tree, "", true, "POST");
  });

  shuffle(api).forEach((i) => {
    let [method, path, realpath, paramName] = i;
    it(path, () => {
      let [handler, params] = r.find(method, realpath);
      console.log(method, path, realpath, handler.name, params);
      assert.notEqual(null, handler);
      assert.equal(camelCase("rest-api" + path + "-" + method), handler.name);
      assert.equal((path.match(/\:/g) || []).length, params.length);
      assert.equal(params[0].name, paramName);
    });
  });
});
