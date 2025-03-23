import fs from 'fs';
import path from 'path';

import FileStorage from './FileStorage';
import Status from './Status';

export default class LocalFileStorage extends FileStorage {
  config: { absolutePath: string };

  constructor(absolutePath = '') {
    super();
    this.config = { absolutePath };
    this.#initialCheck();
  }

  #initialCheck() {
    try {
      const { absolutePath } = this.config;
      const isExist = fs.existsSync(absolutePath);
      const isDirectory = isExist && fs.lstatSync(absolutePath).isDirectory();

      if (isDirectory) {
        Status.time()
          .title(path.basename(__filename, path.extname(__filename)))
          .state('Directory')
          .message(this.config.absolutePath)
          .success();
        return;
      }
      fs.mkdirSync(absolutePath, { recursive: false });
      Status.time()
        .title(path.basename(__filename, path.extname(__filename)))
        .state('Directory Created')
        .message(this.config.absolutePath)
        .success();
    } catch (error) {
      if (error instanceof Error) {
        Status.time()
          .title(path.basename(__filename, path.extname(__filename)))
          .state('Error')
          .message(error.message)
          .error();
      } else {
        Status.time()
          .title(path.basename(__filename, path.extname(__filename)))
          .state('Error')
          .message(error)
          .error();
      }
    }
  }
  #asFilenamePath(filename) {
    return path.join(this.config.absolutePath, filename);
  }

  // @override
  async getFilenames() {
    return fs.readdirSync(this.config.absolutePath).filter((filename) => {
      let filePath = this.#asFilenamePath(filename);
      return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
    });
  }
  // @override
  async deleteFilename(filename) {
    filename = LocalFileStorage.validateFilename(filename);
    let isFile = this.isFile(filename);
    if (!isFile) return null;
    let filePath = this.#asFilenamePath(filename);
    return await new Promise((resolve, reject) => {
      fs.unlink(filePath, (error) => {
        if (error) reject(error);
        else resolve(filename);
      });
    });
  }
  // @override
  async readStreamFilename(filename) {
    filename = LocalFileStorage.validateFilename(filename);
    let isFile = this.isFile(filename);
    if (!isFile) throw new Error('no such file');
    let read = fs.createReadStream(this.#asFilenamePath(filename));
    return read;
  }
  // @override
  async writeStreamFilename(filename) {
    filename = LocalFileStorage.validateFilename(filename);
    let isFile = this.isFile(filename);
    if (isFile) throw new Error('file already exist');
    let write = fs.createWriteStream(this.#asFilenamePath(filename));
    return write;
  }

  isFile(filename) {
    let filePath = this.#asFilenamePath(filename);
    return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
  }
  getAbsolutePathOfFilename(filename) {
    return this.#asFilenamePath(filename);
  }
}
