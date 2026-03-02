import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();
  const handleStudyNow = () => {
    navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
  };
  const reviewedCount = flashcardSet.cards.filter(
    (card) => card.lastReviewed,
  ).length;
  const totalCards = flashcardSet.cards.length;
  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;
  return (
    <div
      className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20 flex flex-col justify-between"
      onClick={handleStudyNow}
    >
      <div className="space-y-4 ">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center transition-colors duration-300">
            <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1 transition-colors duration-300"
              title={flashcardSet?.documentId?.title}
            >
              {flashcardSet?.documentId?.title}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors duration-300">
              Created {moment(flashcardSet.createdAt).fromNow()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors duration-300">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">
              {totalCards}
              {totalCards === 1 ? " Card" : " Cards"}
            </span>
          </div>
          {reviewedCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg transition-colors duration-300">
              <TrendingUp
                className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
                strokeWidth={2.5}
              />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 transition-colors duration-300">
                {progressPercentage}%
              </span>
            </div>
          )}
        </div>

        {totalCards > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors duration-300">
                Progress
              </span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
                {reviewedCount}/{totalCards} reviewed
              </span>
            </div>
            <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors duration-300">
              <div
                className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 transition-colors duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStudyNow();
          }}
          className="group/btn relative w-full py-2 bg-linear-to-r from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 hover:from-emerald-600 hover:to-teal-600 text-emerald-700 dark:text-emerald-400 hover:text-white dark:hover:text-white font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 overflow-hidden "
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Study Now
          </span>
          <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 " />
        </button>
      </div>
    </div>
  );
};

export default FlashcardSetCard;
