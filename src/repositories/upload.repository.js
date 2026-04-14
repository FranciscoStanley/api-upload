export class UploadRepository {
  async saveFile(file) {
    return this.#toFileEntity(file);
  }

  async saveFiles(files) {
    return files.map((file) => this.#toFileEntity(file));
  }

  #toFileEntity(file) {
    return {
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
