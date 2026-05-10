const http = require("http");

const data = JSON.stringify({
  email: "admin@mahaproperties.com",
  password: "SecurePassword123!",
  securityCode: "1234",
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/admin/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let body = "";
  res.on("data", (d) => (body += d));
  res.on("end", () => {
    console.log("Response:", body);
    process.exit(0);
  });
});

req.on("error", (e) => {
  console.error("Error:", e.message);
  process.exit(1);
});

req.write(data);
req.end();
