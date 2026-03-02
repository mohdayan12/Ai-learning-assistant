import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import quizService from "../../services/quizService.js";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch quiz results.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }
  if (!results || !results.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Quiz result not found.</p>
        </div>
      </div>
    );
  }

  const {
    data: { quiz, results: detailedResults },
  } = results;

  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const getScoreColor = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-500 ";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding!";
    if (score >= 80) return "Great job!";
    if (score >= 70) return "Good work";
    if (score >= 60) return "Not bad";
    return "Keep practicing";
  };
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          to={`/documents/${quiz.document._id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Back to Document
        </Link>
      </div>
      <PageHeader title={`${quiz.title || "Quiz"}Results`} />

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8 mb-8 transition-colors duration-300">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-15 h-15 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 shadow-lg shadow-emerald-500/25 transition-colors duration-300">
            <Trophy className="w-7 h-7 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
          </div>
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase mb-2 transition-colors duration-300">
              Your Score
            </p>
            <div
              className={`inline-block text-5xl font-bold bg-linear-to-r ${getScoreColor(score)} bg-clip-text text-transparent mb-2`}
            >
              {score}%
            </div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
              {getScoreMessage(score)}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors duration-300">
              <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" strokeWidth={2} />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {totalQuestions} Total
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl transition-colors duration-300">
              <CheckCircle2
                className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                strokeWidth={2}
              />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {correctAnswers} Correct
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-xl transition-colors duration-300">
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" strokeWidth={2} />
              <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                {incorrectAnswers} Incorrect
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={2} />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-300">
            Detailed Review
          </h3>
        </div>

        {detailedResults.map((result, index) => {
          const userAnswerIndex = result.options.findIndex(
            (opt) => opt === result.selectedAnswer,
          );
          const correctAnswerIndex = result.correctAnswer.startsWith("O")
            ? parseInt(result.correctAnswer.substring(1)) - 1
            : result.options.findIndex((opt) => opt === result.correctAnswer);
          const isCorrect = result.isCorrect;

          return (
            <div
              key={index}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 p-6 transition-colors duration-300"
            >
              <div className="flex items-start justify-between gap-4 mb-3 ">
                <div className="flex-1">
                  <div className="bg-slate-50 dark:bg-slate-800 inline-flex items-center gap-2 px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg mb-3 transition-colors duration-300">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Question {index + 1}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed transition-colors duration-300">
                    {result.question}
                  </h4>
                </div>
                <div
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${isCorrect
                      ? "bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-800/50"
                      : "bg-rose-50 dark:bg-rose-900/30 border-2 border-rose-200 dark:border-rose-800/50"
                    }`}
                >
                  {isCorrect ? (
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <XCircle
                      className="w-5 h-5 text-rose-600 dark:text-rose-400"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {result.options.map((option, optIndex) => {
                  const isCorrectOption = optIndex === correctAnswerIndex;
                  const isUserAnswer = optIndex === userAnswerIndex;
                  const isWrongAnswer = isUserAnswer && !isCorrect;

                  return (
                    <div
                      key={optIndex}
                      className={`relative px-4 py-3 rounded-lg border-2 transition-all duration-200 ${isCorrectOption
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 shadow-lg shadow-emerald-500/10"
                          : isWrongAnswer
                            ? "bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700"
                            : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`text-sm font-medium ${isCorrectOption ? "text-emerald-900 dark:text-emerald-100" : isWrongAnswer ? "text-rose-900 dark:text-rose-100" : "text-slate-700 dark:text-slate-300"}`}
                        >
                          {option}
                        </span>
                        <div className="flex items-center gap-2">
                          {isCorrectOption && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                              <CheckCircle2
                                className="w-3 h-3"
                                strokeWidth={2.5}
                              />
                              Correct
                            </span>
                          )}
                          {isWrongAnswer && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 dark:bg-rose-900/40 border border-rose-300 dark:border-rose-700 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400">
                              <XCircle className="w-3 h-3" strokeWidth={2.5} />
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {result.explanation && (
                <div className="p-4 bg-linear-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors duration-300">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center mt-0.5 transition-colors duration-300">
                      <BookOpen
                        className="w-4 h-4 text-slate-600 dark:text-slate-400"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1 ">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1 transition-colors duration-300">
                        Explanation
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed transition-colors duration-300">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to={`/documents/${quiz.document._id}`}>
          <button className="group relative px-8 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              <ArrowLeft
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
                strokeWidth={2.5}
              />
              Return to Document
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default QuizResultPage;
