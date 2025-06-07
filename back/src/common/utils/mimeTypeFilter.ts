import { BadRequestException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

type FileFilter = MulterOptions["fileFilter"];

export const imagePattern = /\/(jpg|jpeg|png|)$/;

type MimeTypeFilter = (pattern: RegExp) => FileFilter;

export const mimeTypeFilter: MimeTypeFilter = pattern => (req, file, cb) => {
  if (file.mimetype.match(pattern)) {
    cb(null, true);
  } else {
    cb(new BadRequestException("Invalid file type"), false);
  }
};
