import assert from "assert";
import Benchmark from "benchmark";

import { pathToRegexp } from "path-to-regexp";
import RouteRecognizer from "route-recognizer";
import Routington from "routington";
import wayfarer from "wayfarer";
import { Router as OriginalTrekRouter } from "../original.js";
import { Router } from "../index.mjs";

import gplusApi from "../fixtures/gplus-api.js";
import parseApi from "../fixtures/parse-api.js";
import githubApi from "../fixtures/github-api.js";
import discourseApi from "../fixtures/discourse-api.js";

const noop = async () => {};

for (const suite of [
  { name: "Google+", api: gplusApi },
  // { name: "Parse", api: parseApi },
  // { name: "GitHub", api: githubApi },
  // { name: "Discourse", api: discourseApi },
]) {
  const origTrekRoutes = new OriginalTrekRouter();
  const trekRoutes = new Router();
  const pathToRegexpRoutes = {};
  const routeRecognizerRoutes = {};
  const routingtonRoutes = {};
  const wayfarerRoutes = {};
  for (const [method, path] of suite.api) {
    origTrekRoutes.add(method, path, noop);
    trekRoutes.add(method, path, noop);

    const keys = [];
    const r1 = pathToRegexpRoutes[method] || (pathToRegexpRoutes[method] = []);
    r1.push(pathToRegexp(path, keys));

    const r2 =
      routeRecognizerRoutes[method] ||
      (routeRecognizerRoutes[method] = new RouteRecognizer());
    r2.add([{ path, handler: noop }]);

    const r4 =
      routingtonRoutes[method] || (routingtonRoutes[method] = new Routington());
    r4.define(path);

    const r5 = wayfarerRoutes[method] || (wayfarerRoutes[method] = wayfarer());
    r5.on(path, noop);
  }

  console.log("=======================================");
  console.log("Bench w/ %s API, %s routes", suite.name, suite.api.length);
  console.log("=======================================");
  new Benchmark.Suite()
    .add("trek-router(original)", () => {
      for (const [method, , realpath] of suite.api) {
        const [handler] = origTrekRoutes.find(method, realpath);
        assert.notEqual(null, handler);
      }
    })
    .add("trek-router", () => {
      for (const [method, , realpath] of suite.api) {
        const [handler] = trekRoutes.match(method, realpath);
        assert.notEqual(null, handler);
      }
    })
    // .add("path-to-regexp", () => {
    //   for (const [method, , realpath] of suite.api) {
    //     const r = pathToRegexpRoutes[method];
    //     const [result] = r.filter((j) => j.exec(realpath));
    //     assert.notEqual(null, result);
    //   }
    // })
    // .add("route-recognizer", () => {
    //   for (const [method, , realpath] of suite.api) {
    //     const r = routeRecognizerRoutes[method];
    //     const result = r.recognize(realpath);
    //     assert.notEqual(null, result);
    //   }
    // })
    // .add("routington", () => {
    //   for (const [method, , realpath] of suite.api) {
    //     const r = routingtonRoutes[method];
    //     const result = r.match(realpath);
    //     assert.notEqual(null, result);
    //   }
    // })
    // .add("wayfarer", () => {
    //   for (const [method, , realpath] of suite.api) {
    //     const r = wayfarerRoutes[method];
    //     const result = r(realpath);
    //     assert.notEqual(null, result);
    //   }
    // })
    .on("cycle", (ev) => {
      console.log(String(ev.target));
      console.log("memoryUsage:", process.memoryUsage());
    })
    .on("complete", (ev) => {
      console.log("");
      console.log(
        "✨ Fastest is %s",
        Benchmark.filter(ev.currentTarget, "fastest")[0].name
      );
      console.log("");
    })
    .run();
}
