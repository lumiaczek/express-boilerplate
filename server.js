require("dotenv").config();
const https = require("https");
const fs = require("fs");
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");

const morganMiddleware = require(__dirname + "/src/middleware/morgan.mdl.js");
const logger = require(__dirname + "/src/utils/logger.js");

const PORT = process.env.PORT || 5050;

const options = {
  key: fs.readFileSync(__dirname + "/keys/key.pem"),
  cert: fs.readFileSync(__dirname + "/keys/cert.pem"),
};

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(morganMiddleware);

app.disable("x-powered-by");

app.get("/", async (req, res) => {
  res.status(200).send({ message: "Nothing to see here!" });
});

app.get("/api/status", async (req, res) => {
  logger.info("API Status: OK");
  res.status(200).send({
    status: "UP",
    message: "The API is up!",
  });
});

https.createServer(options, app).listen(PORT, () => {
  logger.info(`API is up on https://127.0.0.1:${PORT}`);
});
