import React, { useState } from "react";
import { X, Download, Copy, Check } from "lucide-react";
import type { ResumeData } from "@/types/resume";
import { getTemplateById } from "@/templates/templateRegistry";

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  templateId: string;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({
  isOpen,
  onClose,
  resumeData,
  templateId,
}) => {
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const template = getTemplateById(templateId);
  const TemplateComponent = template?.component;

  if (!isOpen) return null;

  const handleDownloadClick = () => {
    setShowNameDialog(true);
  };

  const handleSaveAndExitClick = () => {
    setShowNameDialog(true);
  };

  const handleNameSubmit = () => {
    if (resumeName.trim()) {
      setShowNameDialog(false);
      setShowDownloadDialog(true);
    }
  };

  const handleSaveResume = async () => {
    setIsDownloading(true);

    try {
      const payload = {
        resumeName: resumeName,
        templateId: templateId,
        resumeData: resumeData,
      };

      console.log("Save Resume Payload:", payload);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Resume saved successfully!");
      setShowDownloadDialog(false);
      onClose();
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const payload = {
        resumeName: resumeName,
        templateId: templateId,
        resumeData: resumeData,
        format: "pdf",
      };

      console.log("Download PDF Payload:", payload);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(`PDF "${resumeName}.pdf" would be downloaded here`);
      setShowDownloadDialog(false);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const resumeLink = `https://bowizzy.com/resume/builder/id001/${resumeName
        .toLowerCase()
        .replace(/\s+/g, "-")}-python-developer`;

      await navigator.clipboard.writeText(resumeLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Error copying link:", error);
      alert("Failed to copy link");
    }
  };

  const generateResumeLink = () => {
    return resumeName.trim()
      ? `https://bowizzy.com/resume/builder/id001/${resumeName
          .toLowerCase()
          .replace(/\s+/g, "-")}-python-developer`
      : "Enter resume name to generate link";
  };

  return (
    <>
      {/* Backdrop - Only blurs main content area, not sidebar/nav */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        style={{
          left: "255px",
          top: "83px",
        }}
        onClick={onClose}
      />

      {/* Modal Container - Slides from right */}
      <div className="fixed right-50 top-0 bottom-0 z-50 flex items-center">
        {/* Resume Preview Modal */}
        <div
          className=" h-[560px] overflow-auto   scrollbar-hide"
          style={{ width: "650px" }}
        >
          <div className="p-8 flex justify-center ">
            <div className="flex flex-col items-center">
              {/* Resume Preview */}
              <div
                className="shadow-lg"
                style={{
                  transform: "scale(1)",
                  transformOrigin: "center",
                }}
              >
                {TemplateComponent && <TemplateComponent data={resumeData} />}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Positioned on the right edge */}
        <div className="flex flex-col gap-4 ml-4">
          {/* Back to Edit Button */}
          <button
            onClick={onClose}
            className="flex items-center bg-white text-left py-3 px-4 rounded-full border-0 hover:bg-gray-50 transition-colors shadow-md cursor-pointer"
          >
            <X className="w-5 h-5 mr-2" />
            <span className="text-black text-sm font-medium whitespace-nowrap">
              Back to Edit
            </span>
          </button>

          {/* Save and Exit Button */}
          <button
            onClick={handleSaveAndExitClick}
            disabled={isDownloading}
            className="flex items-center bg-white text-left py-3 px-4 rounded-full border-0 hover:bg-gray-50 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-black text-sm font-medium whitespace-nowrap">
              Save and Exit
            </span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownloadClick}
            disabled={isDownloading}
            className="flex items-center bg-white text-left py-3 px-4 rounded-full border-0 hover:bg-gray-50 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-black text-sm font-medium whitespace-nowrap">
              Download
            </span>
          </button>
        </div>
      </div>

      {/* Resume Name Dialog */}
      {showNameDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => setShowNameDialog(false)}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowNameDialog(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Resume Name
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 ">
                  Save As (Name)
                </label>
                <input
                  type="text"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  placeholder="Enter Resume Name"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowNameDialog(false)}
                  className="px-6 py-2.5 text-sm font-medium text-orange-500 border border-orange-500 rounded-full hover:bg-orange-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNameSubmit}
                  disabled={!resumeName.trim()}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save and Exit
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Download Dialog with Resume Preview */}
      {showDownloadDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => setShowDownloadDialog(false)}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-[50%] max-w-3xl p-8 relative max-h-[65vh] ">
              <button
                onClick={() => setShowDownloadDialog(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Your Resume
              </h3>

              <div className="flex gap-6 mb-8">
                {/* Resume Thumbnail
                <div className="flex-shrink-0 w-48">
                  <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                    <div className="transform scale-[0.23] origin-top-left w-[435%]">
                      {TemplateComponent && (
                        <TemplateComponent data={resumeData} />
                      )}
                    </div>
                  </div>
                </div> */}

                {/* Resume Details */}
                <div className="flex-1 min-w-0">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={resumeName}
                        onChange={(e) => setResumeName(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent pr-12"
                        placeholder="Enter resume name"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600">
                        <svg
                          className="w-2 h-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Add resume name or edit name, then click on the check
                      button to get the resume link
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume Link
                    </label>
                    <div className="px-4 py-3 text-sm bg-blue-50 border border-blue-200 rounded-lg text-blue-600 break-all">
                      {generateResumeLink()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleSaveResume}
                  disabled={isDownloading || !resumeName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? "Saving..." : "Save Resume"}
                </button>

                <button
                  onClick={handleCopyLink}
                  disabled={!resumeName.trim()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading || !resumeName.trim()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isDownloading ? "Downloading..." : "Download (.pdf)"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResumePreviewModal;
