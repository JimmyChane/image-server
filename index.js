// module
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");

// tool
const CacheControl = require("./tools/CacheControl");
const ENV = require("./tools/ENV");
const LocalFileStorage = require("./tools/LocalFileStorage");
const ImageStorage = require("./tools/ImageStorage");

// config
const port = ENV.isProduction() ? 83 : 81;
const pathBackground = path.join(__dirname, "./public");
const expires = "604800";
const cacheControl = new CacheControl().maxAge(expires).public().toString();

// create
const storage = new LocalFileStorage(pathBackground);
const imageStorage = new ImageStorage(storage);

// express
const app = express();
app.use(cors());
app.use(
  imageStorage.use({
    cacheControl: cacheControl.toString(),
    expires,
  }),
);

// server
const createServer = () => {
  if (ENV.isProduction()) {
    const pathPrivateKey = path.join(__dirname, "./ssl/privkey.pem");
    const pathCertKey = path.join(__dirname, "./ssl/cert.pem");

    return https.createServer({
      key: fs.readFileSync(pathPrivateKey, "utf-8"),
      cert: fs.readFileSync(pathCertKey, "utf-8"),
    });
  }
  return http.createServer(app);
};
createServer().listen(port, () => {
  console.log(`server started in http://localhost:${port}`);
});
