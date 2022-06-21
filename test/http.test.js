import http from "http";
import finalhandler from "finalhandler";
import request from "supertest";
import { Router } from "../index.mjs";

const createServer = (router) =>
  http.createServer((req, res) => {
    const [handler, params] = router.find(req.method, req.url);
    if (handler) {
      req.params = params;
      return handler(req, res);
    }

    finalhandler(req, res);
  });

describe("HTTP Server", () => {
  let r;
  beforeEach(() => {
    r = new Router();
  });

  it("should be used for http server", (done) => {
    r.add("GET", "/", (_, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("hello, world");
    });

    let server = createServer(r);

    request(server).get("/").expect(200, "hello, world", done);
  });

  it("should return params", (done) => {
    r.add("GET", "/:anyway", (req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(req.params));
    });

    let server = createServer(r);

    request(server)
      .get("/233")
      .expect(200, [{ value: "233", name: "anyway" }], done);
  });
});
