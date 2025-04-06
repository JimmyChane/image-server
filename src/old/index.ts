// module
import cors from 'cors';
import express from 'express';
import http from 'http';
import https from 'https';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// tool
import { CacheControl } from './CacheControl';
import { isProduction } from './ENV';
import { ImageStorage } from './ImageStorage';
import { LocalFileStorage } from './LocalFileStorage';

// config
const port = isProduction() ? 83 : 81;
const pathBackground = join(__dirname, '../public');
const expires = '604800';
const cacheControl = new CacheControl().maxAge(expires).public().toString();

// create
const storage = new LocalFileStorage(pathBackground);
const imageStorage = new ImageStorage(storage);

// express
const app = express();
app.use(cors());
app.use(imageStorage.use({ cacheControl: cacheControl.toString(), expires }));

// server
const createServer = () => {
  if (isProduction()) {
    const pathPrivateKey = join(__dirname, '../ssl/privkey.pem');
    const pathCertKey = join(__dirname, '../ssl/cert.pem');

    return https.createServer({
      key: readFileSync(pathPrivateKey, 'utf-8'),
      cert: readFileSync(pathCertKey, 'utf-8'),
    });
  }
  return http.createServer(app);
};
createServer().listen(port, () => {
  console.log(`server started in http://localhost:${port}`);
});
