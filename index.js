const net = require("node:net");
const {
  send400,
  send200,
  sendGet200,
  splitBody,
  isMethodValid,
  isBodyValid,
  parseHeaders,
} = require("./helpers.js");

const server = net.createServer((c) => {
  console.log("client connected");

  c.on("data", (buffer) => {
    const doubleLineBreakIndex = buffer.indexOf("\r\n\r\n");
    if (doubleLineBreakIndex === -1) {
      return;
    }
    console.log(buffer);

    const headerString = buffer.toString("ascii", 0, doubleLineBreakIndex);
    console.log(headerString);
    const lines = headerString.split("\r\n");
    const [method, path, version] = lines[0].split(" ");
    const headers = parseHeaders(lines);
    let body = ""; //body is for post method
    const contentLength = headers["Content-Length"];

    if (!isMethodValid(method)) {
      send400(c);
    }

    if (["POST", "PUT", "PATCH"].includes(method)) {
      body = splitBody(lines);

      if (!isBodyValid(contentLength, body)) {
        send400(c);
      }
    }

    if (method === "GET") {
      const [route, queryString] = path.split("?");
      const queryData = {};
      if (queryString) {
        const pairs = queryString.split("&");
        for (let i in pairs) {
          let pair = pairs[i].split("=");
          const [key, value] = pair;
          queryData[key] = value;
          console.log("queryData", queryData);
          sendGet200(c, JSON.stringify(queryData));
          return;
        }
      }
    }

    if (!method || !path) {
      //bad request
      send400(c);
      return;
    }

    send200(c, body);
  });

  c.on("end", () => {
    console.log("client disconnected");
  });
});

server.listen(3001, () => {
  console.log("server bound");
});
