import React, { useState, useEffect } from "react";
import flashcardService from "../../services/flashcardService.js";
import Spinner from "../../components/common/Spinner.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import toast from "react-hot-toast";
import FlashcardSetCard from "../../components/flashcards/FlashcardSetCard";

const FlashcardsListPage = () => {
  const [flashcardSet, setFlashcardSet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        response = await flashcardService.getAllFlashcardSets();
        console.log("fetchFlashcardSets___", response.data);
        setFlashcardSet(response.data);
      } catch (error) {
        toast.error("Failed to fetch flashcard sets");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcardSets();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }
    if (flashcardSet.length === 0) {
      return (
        <EmptyState
          title="No Flashcard Set Found"
          description="You have not  generated any flashcard yet.Go to a document to create your first set."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {flashcardSet.map((set) => {
          <FlashcardSetCard key={set._id} flashcardSet={set} />;
        })}
      </div>
    );
  };
  return (
    <div>
      <PageHeader title="All Flashcard Sets" />
      {renderContent()}
    </div>
  );
};

export default FlashcardsListPage;
