export function parseHeaders(lines) {
  const headers = {};
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "") break;
    const [key, value] = lines[i].split(": ");
    headers[key] = value;
  }
  return headers;
}

export function splitBody(lines) {
  const emptyIndex = lines.indexOf("");
  const body = lines.splice(emptyIndex + 1).join("\r\n");
  console.log("body", body);
  return body;
}

export function send400(socket, message = "Bad Request") {
  socket.write(
    "HTTP/1.1 400 Bad Request\r\n" +
      "Content-Type: text/plain\r\n" +
      `Content-Length: ${message.length}\r\n` +
      "\r\n" +
      message,
  );
}

export function send200(socket, body = "") {
  socket.write(
    "HTTP/1.1 200\r\n" +
      "Content-Type: text/plain\r\n" +
      `Content-Length: ${body.length}\r\n` +
      "\r\n" +
      body,
  );
}

export function sendGet200(socket, query, contentType = "text/plain") {
  socket.write(
    "HTTP/1.1 200 OK\r\n" +
      `Content-Type": ${contentType}\r\n` +
      `Content-Length: ${query.length}\r\n` +
      "\r\n" +
      query,
  );
}

export function isMethodValid(method) {
  const m = ["POST", "GET", "PUT", "DELETE"];
  console.log("is this called---", m.includes(method));
  return m.includes(method);
}

export function isBodyValid(contentLength, body) {
  if (!body || contentLength) return false;
  return body.length === parseInt(contentLength);
}
