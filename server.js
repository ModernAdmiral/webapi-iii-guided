const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

//middleware

// function logger(req, res, next) {
//   console.log(`${req.method} to ${req.originalUrl}`);
//   next(); //allows the req to continue to the next middleware or route handler
// }

// write a gatekeeper middleware that reads a password from th headers and if the massword is "mellon", let it continue,
// if not send bac 401 and a message

function gatekeeper(req, res, next) {
  if (req.headers.password === "mellon") {
    res.send(200);
    next();
  } else {
    res.send(404).json({ message: "Wrong password" });
  }
}

// server.use(logger);
server.use(gatekeeper);
server.use(express.json()); //built in middleware
// server.use(helmet()); //use middleware here for it to apply to everything
//endpoints

server.use("/api/hubs", hubsRouter); // put middle ware here for this general route

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get("/echo", (req, res) => {
  res.send(req.headers);
});

server.get("/secret", gatekeeper(), helmet(), (req, res) => {
  // put middleware here for specific route
  res.send(req.headers);
});

module.exports = server;
