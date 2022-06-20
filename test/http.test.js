import http from "http";
import finalhandler from "finalhandler";
import request from "supertest";
import { Router } from "../index.js";

describe("HTTP Server", () => {
  let r;
  beforeEach(() => {
    r = new Router();
  });

  it("should be used for http server", (done) => {
    r.add("GET", "/", helloWorld);

    let server = createServer(r);

    request(server).get("/").expect(200, "hello, world", done);
  });

  it("should return params", (done) => {
    r.add("GET", "/:anyway", sawParams);

    let server = createServer(r);

    request(server)
      .get("/233")
      .expect(200, [{ value: "233", name: "anyway" }], done);
  });
});

function createServer(router) {
  return http.createServer(function onRequest(req, res) {
    var result = router.find(req.method, req.url);
    if (result) {
      req.params = result[1];
      return result[0](req, res);
    }
    finalhandler(req, res);
  });
}

function helloWorld(_req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("hello, world");
}

function sawParams(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.params));
}
