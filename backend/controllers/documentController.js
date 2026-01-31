import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import fs from "fs/promises";
import mongoose from "mongoose";

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload  the PDF file",
        statusCode: 400,
      });
    }
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Please provide the document title",
        statusCode: 400,
      });
    }
    const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.path}`;
    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: fileUrl,
      fileSize: req.file.size,
      status: "processing",
    });

    processPDF(document._id, req.file.path).catch((err) => {
      console.error("PDF processing error", err);
    });

    res.status(200).json({
      success: true,
      data: document,
      message: "Document upload sucessfully.Processing is progress...",
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

const processPDF = async (documentId, filePath) => {
  try {
    const { text } = await extractTextFromPDF(filePath);
    const chunks = chunkText(text, 500, 50);
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: "ready",
    });
    console.log(`Document ${documentId} processed successfully`);
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);
    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
    });
  }
};
