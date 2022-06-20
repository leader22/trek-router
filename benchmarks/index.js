import assert from "power-assert";
import Benchmark from "benchmark";

import { pathToRegexp } from "path-to-regexp";
import RouteRecognizer from "route-recognizer";
// CJS export only...
// import RouteTrie from 'route-trie'
import Routington from "routington";
import wayfarer from "wayfarer";
import { Router } from "../index.js";

import api from "../fixtures/github-api.js";
import api0 from "../fixtures/discourse-api.js";

const noop = async () => {};

const routes0 = new Router();
const routes1 = {};
const routes2 = {};
// const routes3 = {}
const routes4 = {};
const routes5 = {};
for (const [method, path] of api) {
  routes0.add(method, path, noop);

  const keys = [];
  const r1 = routes1[method] || (routes1[method] = []);
  r1.push(pathToRegexp(path, keys));

  const r2 = routes2[method] || (routes2[method] = new RouteRecognizer());
  r2.add([
    {
      path: path,
      handler: noop,
    },
  ]);

  // const r3 = routes3[method] || (routes3[method] = new RouteTrie())
  // r3.define(path)

  const r4 = routes4[method] || (routes4[method] = new Routington());
  r4.define(path);

  const r5 = routes5[method] || (routes5[method] = wayfarer());
  r5.on(path, noop);
}

console.log("==========================");
console.log("GitHub API, %s routes", api.length);
console.log("==========================");
new Benchmark.Suite()
  .add("trek-router", () => {
    for (const [method, , realpath] of api) {
      const [handler] = routes0.find(method, realpath);
      assert.notEqual(null, handler);
    }
  })
  .add("path-to-regexp", () => {
    for (const [method, , realpath] of api) {
      const r = routes1[method];
      const [result] = r.filter((j) => j.exec(realpath));
      assert.notEqual(null, result);
    }
  })
  .add("route-recognizer", () => {
    for (const [method, , realpath] of api) {
      const r = routes2[method];
      const result = r.recognize(realpath);
      assert.notEqual(null, result);
    }
  })
  // .add('route-trie', () => {
  //   for (const [method, , realpath] of api) {
  //     const r = routes3[method]
  //     const result = r.match(realpath)
  //     assert.notEqual(null, result)
  //   }
  // })
  .add("routington", () => {
    for (const [method, , realpath] of api) {
      const r = routes4[method];
      const result = r.match(realpath);
      assert.notEqual(null, result);
    }
  })
  .add("wayfarer", () => {
    for (const [method, , realpath] of api) {
      const r = routes5[method];
      const result = r(realpath);
      assert.notEqual(null, result);
    }
  })
  .on("cycle", (ev) => {
    console.log(String(ev.target));
    console.log("memoryUsage:", process.memoryUsage());
  })
  .on("complete", (ev) => {
    console.log("");
    console.log(
      "Fastets is",
      Benchmark.filter(ev.currentTarget, "fastest")[0].name
    );
    console.log("");
  })
  .run();

// ====================================================================

const routes00 = new Router();
const routes10 = {};
const routes20 = {};
// const routes30 = {}
const routes40 = {};
const routes50 = {};
for (const [method, path] of api0) {
  routes00.add(method, path, noop);

  const keys = [];
  const r1 = routes10[method] || (routes10[method] = []);
  r1.push(pathToRegexp(path, keys));

  const r2 = routes20[method] || (routes20[method] = new RouteRecognizer());
  r2.add([
    {
      path: path,
      handler: noop,
    },
  ]);

  // const r3 = routes30[method] || (routes30[method] = new RouteTrie())
  // r3.define(path)

  const r4 = routes40[method] || (routes40[method] = new Routington());
  r4.define(path);

  const r5 = routes50[method] || (routes50[method] = wayfarer());
  r5.on(path, noop);
}

console.log("==========================");
console.log("Discourse API, %s routes", api0.length);
console.log("==========================");
new Benchmark.Suite()
  .add("trek-router", () => {
    for (const [method, , realpath] of api0) {
      const [handler] = routes00.find(method, realpath);
      assert.notEqual(null, handler);
    }
  })
  .add("path-to-regexp", () => {
    for (const [method, , realpath] of api0) {
      const r = routes10[method];
      const [result] = r.filter((j) => j.exec(realpath));
      assert.notEqual(null, result);
    }
  })
  .add("route-recognizer", () => {
    for (const [method, , realpath] of api0) {
      const r = routes20[method];
      const result = r.recognize(realpath);
      assert.notEqual(null, result);
    }
  })
  // .add('route-trie', () => {
  //   for (const [method, , realpath] of api0) {
  //     const r = routes30[method]
  //     const result = r.match(realpath)
  //     assert.notEqual(null, result)
  //   }
  // })
  .add("routington", () => {
    for (const [method, , realpath] of api0) {
      const r = routes40[method];
      const result = r.match(realpath);
      assert.notEqual(null, result);
    }
  })
  .add("wayfarer", () => {
    for (const [method, , realpath] of api0) {
      const r = routes50[method];
      const result = r(realpath);
      assert.notEqual(null, result);
    }
  })
  .on("cycle", (ev) => {
    console.log(String(ev.target));
    console.log("memoryUsage:", process.memoryUsage());
  })
  .on("complete", (ev) => {
    console.log("");
    console.log(
      "Fastets is",
      Benchmark.filter(ev.currentTarget, "fastest")[0].name
    );
    console.log("");
  })
  .run();
