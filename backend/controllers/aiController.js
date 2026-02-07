import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";
import Flashcard from "../models/Flashcard.js";
import * as geminiService from "../utils/geminiService.js";
import { findReleventChunks } from "../utils/textChunker.js";
import ChatHistory from "../models/ChatHistory.js";

export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        status: false,
        error: "Please provide documentId",
        statusCode: 400,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        status: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }

    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      parseInt(count),
    );

    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document.id,
      cards: cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
      })),
    });
    res.status(200).json({
      success: false,
      data: flashcardSet,
      message: "Flashcard generate successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title } = req.body;

    if (!documentId) {
      return res.status(400).json({
        status: false,
        error: "Please provide documentId",
        statusCode: 400,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        status: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }
    const questions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(numQuestions),
    );

    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document.id,
      title: title || `${document.title} - Quiz`,
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0,
    });
    res.status(201).json({
      success: false,
      data: quiz,
      message: "Quiz generate successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        status: false,
        error: "Please provide documentId",
        statusCode: 400,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        status: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }
    const summary = await geminiService.generateSummary(document.extractedText);

    res.status(200).json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        summary,
      },
      message: "Summary generate successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        status: false,
        error: "Please provide documentId and question",
        statusCode: 400,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        status: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }

    const relevantChunks = findRelevantChunks(document.chunks, question, 3);
    const chunkIndices = relevantChunks.map((c) => c.chunkIndex);

    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id,
    });
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        messages: [],
      });
    }
    const answer = await geminiService.chatWithContext(
      question,
      relevantChunks,
    );

    chatHistory.messages.push(
      {
        role: "user",
        content: question,
        timestamp: new Date(),
        relevantChunks: [],
      },
      {
        role: "assistant",
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices,
      },
    );

    await chatHistory.save();
    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id,
      },
      message: "Response generate successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    if (!documentId || !concept) {
      return res.status(400).json({
        status: false,
        error: "Please provide documentId and concept",
        statusCode: 400,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        status: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }

    const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
    const context = relevantChunks.map((c) => c.content).join("\n\n");

    const explaination = await geminiService.explainConcept(concept, context);
    res.status(200).json({
      success: true,
      data: {
        concept,
        explaination,
        relevantChunks: relevantChunks.map((c) => c.chunkIndex),
      },
      message: "Explaination generate successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        status: false,
        error: "Please provide documentId",
        statusCode: 400,
      });
    }
    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id,
    }).select("messages");
    if (!chatHistory) {
      return res.status(200).json({
        status: true,
        data: [],
        message: "No chat history found for this document",
      });
    }
    res.status(200).json({
      status: true,
      data: chatHistory.messages,
      message: "Chat history retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};
