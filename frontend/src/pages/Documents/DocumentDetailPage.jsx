import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService.js";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ChevronsLeftRightEllipsis, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader.jsx";
import Tabs from "../../components/common/Tabs.jsx";
import ChatInterface from "../../components/chat/ChatInterface.jsx";
import AIActions from "../../components/ai/AIActions.jsx";
import FlashcardManager from "../../components/flashcards/FlashcardManager.jsx";
import QuizManager from "../../components/quizzes/QuizManager.jsx";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        console.log("data h yeh",data) 
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch documents details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentDetails();
  }, [id]);

  const getPDFUrl = () => {
    if (!document?.data?.filePath) return null;
    const filePath = document.data.filePath;
    if (filePath.startsWith("https://") || filePath.startsWith("http://")) {
      return filePath;
    }
    const baseUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:5000";
    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }
    if (!document || !document.data || !document.data.filePath) {
      return <div className="text-center p-8">PDF not available.</div>;
    }
    const pdfUrl = getPDFUrl();

    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm transition-colors duration-300">
        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-300 dark:border-slate-700 transition-colors duration-300">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Document Viewer
          </span>
          <a
            href={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>
        <div className="bg-gray-100 dark:bg-slate-950 p-1 transition-colors duration-300">
          <iframe
            src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
            className="w-full h-[70vh] bg-white dark:bg-slate-800 rounded border border-gray-300 dark:border-slate-700 transition-colors duration-300"
            title="PDF Viewer"
            frameBorder="0"
            style={{
              colorScheme: "light",
            }}
          />

        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />;
  };

  const renderAIAction = () => {
    return <AIActions />;
  };

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />;
  };

  const renderQuizzesTab = () => {
    return <QuizManager documentId={id} />
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIAction() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return <div className="text-center p-8">Document not found.</div>;
  }
  return (
    <div>
      <div className="mb-4">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Documents
        </Link>
      </div>
      <PageHeader title={document.data.title} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentDetailPage;
