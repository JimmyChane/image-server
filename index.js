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
const app = express()
  .use(cors())
  .use("/:name", (req, res, next) => {
    if (req.method !== "GET") return next();

    const { query } = req;
    const { name } = req.params;
    const option = { width: query.width, height: query.height };

    res
      .set("Cache-Control", cacheControl.toString())
      .set("Expires", expires)
      .set("Content-Type", "image")
      .set("Content-Disposition", `inline; filename="${name}"`);

    imageStorage
      .progressImageByFilename(name, option)
      .on("chunk", (chunk) => res.write(chunk))
      .on("end", () => res.end())
      .on("error", (error) => next())
      .call("start");
  })
  .use(
    express.static(path.join(__dirname, "./public"), {
      setHeaders: (res, path) => {
        res.set("Expires", expires);
        res.set("Cache-Control", cacheControl);
      },
      cacheControl: true,
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
