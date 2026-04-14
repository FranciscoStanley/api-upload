import { AppError } from "../errors/app-error.js";
import { UploadRepository } from "../repositories/upload.repository.js";

export class UploadService {
  constructor(uploadRepository = new UploadRepository()) {
    this.uploadRepository = uploadRepository;
  }

  async handleSingle(file, body) {
    if (!file) {
      throw new AppError("Arquivo nao enviado", 400);
    }

    const saved = await this.uploadRepository.saveFile(file);

    return {
      message: "Arquivo enviado com sucesso",
      file: saved,
      body,
    };
  }

  async handleMultiple(files, body) {
    if (!files || files.length === 0) {
      throw new AppError("Arquivos nao enviados", 400);
    }

    const saved = await this.uploadRepository.saveFiles(files);

    return {
      message: "Arquivos enviados com sucesso",
      files: saved,
      body,
    };
  }
}
