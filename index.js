const net = require("node:net");
const server = net.createServer((c) => {
  console.log("client connected");

  c.on("data", (buffer) => {
    const request = buffer.toString();
    const lines = request.split("\r\n");
    const [method, path, version] = lines[0].split(" ");
    const headers = parseHeaders(lines);
    let body = ""; //body is for post method

    if (method === "POST") {
      body = splitBody(lines);
    }

    if (!method || !path) {
      //bad request
      send400(c);
      return;
    }

    if (!isValidMethod(method)) {
      send400(c);
    }

    if ((method === "POST" && !body) || body.trim() === "") {
      send400(c, "Missing body");
      return;
    }
  });

  c.on("end", () => {
    console.log("client disconnected");
  });
});

server.listen(3000, () => {
  console.log("server bound");
});

function parseHeaders(lines) {
  const headers = {};
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "") break;
    const [key, value] = lines[i].split(": ");
    headers[key] = value;
  }
  return headers;
}

function splitBody(lines) {
  const emptyIndex = lines.indexOf("");
  const body = lines.splice(emptyIndex + 1).join("\r\n");
  console.log("body", body);
  return body;
}

function send400(socket, message = "Bad Request") {
  socket.write(
    "HTTP/1.1 400 Bad Request\r\n" +
      "Content-Type: text/plain\r\n" +
      `Content-Length: ${message.length}\r\n` +
      "\r\n" +
      message,
  );
}

function isMethodValid(method) {
  const m = ["POST", "GET", "PUT", "DELETE"];
  return m.includes(method);
}
