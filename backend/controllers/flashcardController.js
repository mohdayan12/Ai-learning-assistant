import Flashcard from "../models/Flashcard.js";

export const getFlashcards = async (req, res, next) => {
  try {
    const flashcard = await Flashcard.find({
      userId: req.user._id,
      documentId: req.params.documentId,
    })
      .populate("document", "title fileName")
      .sort({ created: -1 });

    res.status(200).json({
      success: true,
      count: flashcard.length,
      data: flashcard,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFlashcardSets = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.find({
      userId: req.user._id,
    })
      .populate("document", "title")
      .sort({ created: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      "card._id": req.params.cardId,
      userId: req.user._id,
    });
    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        errro: "Flashcard set or card not found",
        statusCode: 404,
      });
    }

    const cardIndex = flashcardSet.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId,
    )

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        errro: "Card not found in set",
        statusCode: 404,
      });
    }

    flashcardSet.cards[cardIndex].lastReviewed = new Date();
    flashcardSet.cards[cardIndex].reviewCount += 1;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: "Flashcard reviewed successfully ",
    });
  } catch (error) {
    next(error);
  }
};

export const toggleStarFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      "card._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        errro: "Flashcard set or card not found",
        statusCode: 404,
      });
    }

    const cardIndex = flashcardSet.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId,
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        errro: "Card not found in set",
        statusCode: 404,
      });
    }

    flashcardSet.cards[cardIndex].isStarred =
      !flashcardSet.cards[cardIndex].isStarred;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: `Flashcard ${flashcardSet.cards[cardIndex].isStarred ? "starred" : "unstarred"}`,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFlashcardSets = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard not found",
        statusCode: 404,
      });
    }
    
    await flashcardSet.deleteOne();

    res.status(200).json({
      success: true,
      message: "Flashcard set delete successfully",
    });
  } catch (error) {
    next(error);
  }
};
