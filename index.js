const net = require("node:net");
const server = net.createServer((c) => {
  console.log("client connected");

  c.on("data", (buffer) => {
    const request = buffer.toString();
    const lines = request.split("\r\n");
    const [method, path, version] = lines[0].split(" ");

    parseHeaders(lines);

    supportRoutes(path);
    if (method === "POST") {
      console.log("is this called");
      splitBody(lines);
    }

    console.log("method-", method);
    console.log("path-", path);
    console.log("version-", version);
  });

  c.on("end", () => {
    console.log("client disconnected");
  });

  c.pipe(c);
});

server.listen(3000, () => {
  console.log("server bound");
});

function parseHeaders(lines) {
  console.log("headers line->", lines);
  const headers = {};
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
  }

  //  if (line === "") return);

  console.log("headers", headers);
}

function supportRoutes(path) {
  switch (path) {
    case "/":
      return "home";
    case "/users":
      return "users";
    default:
      return "not found";
  }
}

function splitBody(lines) {
  const emptyIndex = lines.indexOf("");
  const body = lines.splice(emptyIndex + 1).join("\r\n");
  console.log("body", JSON.parse(body));
}
