
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// export const extractTextFromPDF = async (buffer) => {
//   try {
//     const uint8Array = new Uint8Array(buffer);
//     const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
//     const pdf = await loadingTask.promise;

//     let fullText = "";

//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const textContent = await page.getTextContent();

//       const pageText = textContent.items
//         .map(item => item.str)
//         .join(" ");

//       fullText += pageText + "\n";
//     }

//     return {
//       text: fullText,
//       numPages: pdf.numPages,
//     };

//   } catch (error) {
//     console.error("PDF parsing error:", error);
//     throw new Error("Failed to extract text from PDF");
//   }
// };

// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const pdf = require("pdf-parse");

// export const extractTextFromPDF = async (buffer) => {
//   try {
//     const data = await pdf(buffer);

//     return {
//       text: data.text,
//       numPages: data.numpages,
//     };

//   } catch (error) {
//     console.error("PDF parsing error:", error);
//     throw new Error("Failed to extract text from PDF");
//   }
// };
import PDFParser from "pdf2json";

export const extractTextFromPDF = async (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let text = "";

      pdfData.Pages.forEach((page) => {
        page.Texts.forEach((textItem) => {
          text += decodeURIComponent(textItem.R[0].T) + " ";
        });
      });

      resolve({
        text,
        numPages: pdfData.Pages.length,
      });
    });

    pdfParser.parseBuffer(buffer);
  });
};
