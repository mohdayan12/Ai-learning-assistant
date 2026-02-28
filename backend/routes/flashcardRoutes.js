import express from "express";
import {
  getFlashcards,
  getAllFlashcardSets,
  reviewFlashcard,
  toggleStarFlashcard,
  deleteFlashcardSets,
} from "../controllers/flashcardController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllFlashcardSets);
router.get("/:documentId", getFlashcards);
router.get("/:cardId/review", reviewFlashcard);
router.put("/:cardId/card", toggleStarFlashcard);
router.delete("/:id", deleteFlashcardSets);

export default router;
