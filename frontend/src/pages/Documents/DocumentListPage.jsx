import React, { useState, useEffect } from "react";
import { Plus, Upload, FileText, Trash2, X } from "lucide-react";
import Spinner from "../../components/common/Spinner";
import documentService from "../../services/documentService.js";
import toast from "react-hot-toast";
import Button from "../../components/common/Button.jsx";
import EmptyState from '../../components/common/EmptyState'
import DocumentCard from '../../components/documents/DocumetCard.jsx'
import StarBackground from '../../components/common/StarBackground.jsx'

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isUploadModelOpen, setIsUploadModelOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch documents");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide the title and select a file");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);
    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully");
      setIsUploadModelOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModelOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`${selectedDoc.title} deleted successfully`);
      setIsDeleteModelOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((doc) => doc._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-100">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center max-w-md">
            <div className="inline-flex justify-center items-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 mb-6 transition-colors duration-300">
              <FileText
                className="w-10 h-10 text-slate-400 dark:text-slate-500"
                strokeWidth={2.5}
              />
            </div>
            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 tracking-tight mb-2 transition-colors duration-300">
              No Documents Yet.
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 transition-colors duration-300">
              Get started by uploading your first PDF document to begin
              learning.
            </p>
            <button
              onClick={() => setIsUploadModelOpen(true)}
              className="inline-flex items-centet gap-2 px-6 py-3 bg-linear-to-r from-emerald-400 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Documents
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5  ">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 dark:opacity-0 pointer-events-none transition-opacity duration-300" />
      <div className="absolute inset-0 opacity-40 dark:opacity-60">
        <StarBackground />
      </div>
      <div className="relative max-w-7xl mx-auto ">
        {/* header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100 tracking-tight mb-2 transition-colors duration-300">
              My Documents
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
              Manage and organize your learning materials
            </p>
          </div>
          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModelOpen(true)}>
              <Plus className="w-4 h-4" />
              Upload Document
            </Button>
          )}
        </div>

        {renderContent()}
      </div>
       {isUploadModelOpen && (
        <div className="fixed inset-0 z-50 flex justify-center lg:items-center items-start lg:mx-auto pt-20 p-4 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8 transition-colors duration-300">
            <button
              onClick={() => setIsUploadModelOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex justify-center items-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300">
                Upload New Document
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">
                Add a PDF document to your library
              </p>
            </div> 

            {/* form */}
             <form onSubmit={handleUpload} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide transition-colors duration-300">
                  Document Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  className="w-full h-12 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:shadow-lg focus:shadow-emerald-500/10"
                  placeholder="e.g, React Interview Prep"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide transition-colors duration-300">
                  PDF File
                </label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 transition-all duration-200 ">
                  <input
                    id="file-upload"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0  cursor-pointer z-10 "
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                  <div className="flex flex-col justify-center items-center py-10 px-6">
                    <div className="w-14 h-14 rounded-xl bg-linear-to-r from-emerald-100 to-teal-100 flex justify-center items-center mb-4">
                      <Upload
                        className="w-7 h-7 text-emerald-600"
                        strokeWidth={2}
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">
                      {uploadFile ? (
                        <span className="text-emerald-600 dark:text-emerald-500">
                          {uploadFile.name}
                        </span>
                      ) : (
                        <>
                          <span className="text-emerald-600 dark:text-emerald-500">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">PDF up to 10MB</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModelOpen(false)}
                  disabled={uploading}
                  className="flex-1 h-11 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 h-11 px-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )} 

      {isDeleteModelOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
          <div className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8 transition-colors duration-300">
            <button
              onClick={() => setIsDeleteModelOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex justify-center items-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-linear-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 flex justify-center items-center mb-4 transition-colors duration-300">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300">
                Confirm Deletion
              </h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 transition-colors duration-300">
              Are you sure you want to delete the document:{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                {selectedDoc?.title}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModelOpen(false)}
                disabled={deleting}
                className="flex-1 h-11 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed "
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-11 px-4 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {deleting ? (
                  <span className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin">

                    </div>
                    deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;
