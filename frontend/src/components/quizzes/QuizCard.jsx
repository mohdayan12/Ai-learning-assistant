import React from "react";
import { Link } from "react-router-dom";
import { Play, BarChart2, Trash2, Award } from "lucide-react";
import moment from "moment";

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-2xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between ">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="p-2 absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/40 rounded-lg transition-all duration-200 opacity-50 group-hover:opacity-100 "
      >
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </button>
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 py-1 rounded-lg text-xs font-semibold ">
          <div className="flex items-centet gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg px-3 py-1 transition-colors duration-300">
            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
            <span className="text-emerald-700 dark:text-emerald-400">Score: {quiz?.score}</span>
          </div>
        </div>
        <div>
          <h3
            className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 line-clamp-1 transition-colors duration-300"
            title={quiz.title}
          >
            {quiz.title ||
              `Quiz - ${moment(quiz.createdAt).format("MMM D, YYYY")}`}
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase transition-colors duration-300">
            Created {moment(quiz.createdAt).format("MMM D, YYYY")}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors duration-300">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">
              {quiz.questions.length}{" "}
              {quiz.questions.length === 1 ? "'Question" : "Questions"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
        {quiz?.userAnswers?.length > 0 ? (
          <Link to={`/quizzes/${quiz._id}/results`}>
            <button className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 cursor-pointer">
              <BarChart2 className="w-4 h-4 " strokeWidth={2.5} />
              View Results
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`}>
            <button className="group/btn w-full relative h-11  bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 overflow-hidden ">
              <span className="relative z-10 flex items-center justify-center gap-2 ">
                <Play className="w-4 h-4" strokeWidth={2.5} />
                Start Quiz
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0  -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
