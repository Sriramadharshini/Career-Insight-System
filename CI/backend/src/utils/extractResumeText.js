import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import WordExtractor from "word-extractor";

const extractor = new WordExtractor();

export const extractResumeText = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".txt") {
    return fs.readFileSync(filePath, "utf-8");
  }

  if (extension === ".pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text || "";
  }

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || "";
  }

  if (extension === ".doc") {
    const document = await extractor.extract(filePath);
    return document.getBody() || "";
  }

  throw new Error("Unsupported file format");
};
