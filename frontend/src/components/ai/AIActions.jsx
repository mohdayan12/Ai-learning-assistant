import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import aiService from "../../services/aiService.js";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer.jsx";
import Model from "../common/Model.jsx";

const AIActions = () => {
  const { id: documentId } = useParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [modelContent, setModelContent] = useState("");
  const [modelTitle, setModelTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const { summary } = await aiService.generateSummary(documentId);
      setModelTitle("Generate Summary");
      setModelContent(summary);
      setIsModelOpen(true);
    } catch (error) {
      toast.error("Failed to generate Summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) {
      toast.error("Please enter the concept to explain");
      return;
    }
    setLoadingAction("explain");
    try {
      const { explanation } = await aiService.explainConcept(
        documentId,
        concept,
      );
      setModelTitle(`Explanation of ${concept}`);
      setModelContent(explanation);
      setIsModelOpen(true);
      setConcept("");
    } catch (error) {
      toast.error("Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-linear-to-br from-slate-50/50 to-white/50 dark:from-slate-950/50 dark:to-slate-900/50 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 shadow-lg shadow-purple-500/25 dark:shadow-emerald-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-300">
                AI Assitant
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">Powered by advanced AI</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300/60 dark:hover:border-slate-600/60 hover:shadow-md dark:hover:shadow-slate-950 transition-all duration-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg lg-linear-to-br bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center transition-colors duration-300">
                    <BookOpen
                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                      strokeWidth={2}
                    />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-300">
                    Generate Summary
                  </h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                  Get concise summary of the entire document
                </p>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={loadingAction === "summary"}
                className="shrink-0 h-10 px-5 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-teal-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/24 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {loadingAction === "summary" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Summarize"
                )}
              </button>
            </div>
          </div>

          <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300/60 dark:hover:border-slate-600/60 hover:shadow-md transition-all duration-200">
            <form onSubmit={handleExplainConcept}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex justify-center items-center transition-colors duration-300">
                  <Lightbulb
                    className="w-4 h-4 text-amber-600 dark:text-amber-400"
                    strokeWidth={2}
                  />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-300">
                  Explain a Concept
                </h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 transition-colors duration-300">
                Enter a topic or concept from the document to get a detailed
                explanation
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  disabled={loadingAction === "explain"}
                  placeholder="e.g., React Hooks"
                  className="flex-1 h-11 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-emerald-500/10"
                />
                <button
                  type="submit"
                  disabled={loadingAction === "explain" || !concept.trim()}
                  className="shrink-0 h-11 px-5 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {loadingAction === "explain" ? (
                    <span className="flex items-center gap-2 ">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    "Explain"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Model
        isOpen={isModelOpen}
        onClose={() => setIsModelOpen(false)}
        title={modelTitle}
      >
        <div className="max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate dark:prose-invert dark:text-white transition-colors duration-300">
          <MarkdownRenderer content={modelContent} />
        </div>
      </Model>
    </>
  );
};

export default AIActions;
