// module
import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import https from "https";
import fs from "fs";

// tool
import CacheControl from "./CacheControl";
import ENV from "./ENV";
import LocalFileStorage from "./LocalFileStorage";
import ImageStorage from "./ImageStorage";

// config
const port = ENV.isProduction() ? 83 : 81;
const pathBackground = path.join(__dirname, "../public");
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
    const pathPrivateKey = path.join(__dirname, "../ssl/privkey.pem");
    const pathCertKey = path.join(__dirname, "../ssl/cert.pem");

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
