import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!process.env.GEMINI_API_KEY) {
  console.error(
    "FATAL ERROR:GEMINI_API_KEY is not set in the enviroment variable",
  );
  process.exit(1);
}

export const generateFlashcards = async (text, count = 10) => {
  const prompt = `Generate exactly ${count} educational flashcard from the following text,
Format each flashcard as:
Q:[Clear,specific question]
A:[Concise,accurate answer]
D:[Difficulty level:easy,medium, or hard]

Separate each flashcard with "---" 

Text:
${text.substring(0, 15000)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const generateText = response.text;

    const flashcards = [];
    const cards = generateText.split("---").filter((c) => c.trim());

    for (const card of cards) {
      const lines = card.trim().split("\n");
      let question = "",
        answer = "",
        difficulty = "medium";

      for (const line of lines) {
        if (line.startsWith("Q:")) {
          question = line.substring(2).trim();
        } else if (line.startsWith("A:")) {
          answer = line.substring(2).trim();
        } else if (line.startsWith("D:")) {
          const diff = line.substring(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && answer) {
        flashcards.push({ question, answer, difficulty });
      }
    }
    return flashcards.slice(0, count);
  } catch (error) {
    console.error("Gemini Api error:", error);
    throw new Error("Failed to generate flashcards");
  }
};

export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text,
Format each question as:
Q:[Question]
O1:[option 1]
O2:[option 2]
O3:[option 3]
O4:[option 4]
C:[Correct option -exactly written above]
E:[Brief explaination]
D:[Difficulty level:easy,medium, or hard]

Separate each flashcard with "---" 

Text:
${text.substring(0, 15000)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const generateText = response.text;

    const questions = [];
    const questionBlocks = generateText.split("---").filter((q) => q.trim());

    for (const block of questionBlocks) {
      const lines = block.trim().split("\n");
      let question = "",
        options = [],
        correctAnswer = "",
        explaination = "",
        difficulty = "medium";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("Q:")) {
          question = trimmed.substring(2).trim();
        } else if (trimmed.match(/^O\d:/)) {
          options.push(trimmed.substring(3).trim());
        } else if (trimmed.startsWith("C:")) {
          correctAnswer = trimmed.substring(2).trim();
        } else if (trimmed.startsWith("E:")) {
          explaination = trimmed.substring(2).trim();
        } else if (trimmed.startsWith("D:")) {
          const diff = line.substring(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff)) {
            difficulty = diff;
          }
        }
      }
      if (question && options === 4 && correctAnswer) {
        questions.push({
          question,
          options,
          correctAnswer,
          explaination,
          difficulty,
        });
      }
      return questions.slice(0, numQuestions);
    }
  } catch (error) {
    console.error("Gemini Api error:", error);
    throw new Error("Failed to generate quiz");
  }
};

export const generateSummary = async (text) => {
  const prompt = `Provide a concise summary of the following text,highlighting the key concepts,main ideas, and important points.Keep the summary clean and structured. 

Text:
${text.substring(0, 20000)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const generateText = response.text;
    return generateText;
  } catch (error) {
    console.error("Gemini Api error:", error);
    throw new Error("Failed to generate summary");
  }
};

export const chatWithContext = async (question, chunks) => {
  const context = chunks
    .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
    .join("\n\n");
  console.log("context___", context);
  const prompt = `Based on the following context from the document,Analyse the context and answer the users question.If the answer is not in the context,say so.
 Context:${context}
 Question:${question}
 Answer:`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    
    const generateText = response.text;
    return generateText;
  } catch (error) {
    console.error("Gemini Api error:", error);
    throw new Error("Failed to process chat request");
  }
};

export const explainConcept = async (concept, context) => {
  const prompt = `Explain the concept of "${concept}" based on the following context.Provide the clear,educational explaination that's easy to understand.Include example if relevent.
Context:${context.substring(0, 1000)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const generateText = response.text;
    return generateText;
  } catch (error) {
    console.error("Gemini Api error:", error);
    throw new Error("Failed to explain concept");
  }
};
