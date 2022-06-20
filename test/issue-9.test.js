import _ from "lodash";
import assert from "power-assert";
import { Router } from "../index.js";
import { printTree } from "./node.js";

describe("Issue #9", () => {
  let r;
  beforeEach(() => {
    r = new Router();
  });

  it("routes", () => {
    r.add("GET", "/:prefix/people/:userId/activities/:collection", () => {});
    r.add("GET", "/:prefix/people/*", () => {});
    printTree(r.tree, "", true);

    let [h0, p0] = r.find("GET", "/xxx/people/377/activities/333");
    assert.notEqual(null, h0);
    assert.deepEqual(p0[p0.length - 1], { value: "333", name: "collection" });

    let [h1, p1] = r.find("GET", "/xxx/people/377/activities");
    assert.notEqual(null, h1);
    assert.deepEqual(p1[p1.length - 1], { name: "*", value: "377/activities" });
  });
});
