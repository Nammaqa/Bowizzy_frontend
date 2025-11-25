import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, RotateCcw, Upload, X } from "lucide-react";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { deleteFromCloudinary } from "@/utils/deleteFromCloudinary";



interface CertificateFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

interface Certificate {
  id: string;
  certificateType: string;
  certificateTitle: string;
  domain: string;
  certificateProvidedBy: string;
  date: string;
  description: string;
  uploadedFile: File | null;
  uploadedFileName: string;
  isExpanded: boolean;
  uploadedFileUrl?: string;  
  uploadedFileDeleteToken?: string;

}

export default function CertificateDetailsForm({
  onNext,
  onBack,
  initialData = {},
}: CertificateFormProps) {
  const [certificates, setCertificates] = useState<Certificate[]>(
    initialData.certificates || [
      {
        id: "1",
        certificateType: "",
        certificateTitle: "",
        domain: "",
        certificateProvidedBy: "",
        date: "",
        description: "",
        uploadedFile: null,
        uploadedFileName: "",
        isExpanded: true,
        
      },
    ]
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation functions
  const validateCertificateTitle = (value: string) => {
    if (value && !/^[a-zA-Z0-9\s.,-:()]+$/.test(value)) {
      return "Invalid characters in certificate title";
    }
    return "";
  };

  const validateDomain = (value: string) => {
    if (value && !/^[a-zA-Z0-9\s.,-/&]+$/.test(value)) {
      return "Invalid characters in domain";
    }
    return "";
  };

  const validateProvider = (value: string) => {
    if (value && !/^[a-zA-Z0-9\s.,&'-]+$/.test(value)) {
      return "Invalid characters in provider name";
    }
    return "";
  };

  const validateFile = (file: File) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return "Only PDF, JPG, and JPEG files are allowed";
    }

    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return "";
  };

  const handleCertificateChange = (
    index: number,
    field: string,
    value: string | boolean | File | null
  ) => {
    const updated = [...certificates];
    updated[index] = { ...updated[index], [field]: value };
    setCertificates(updated);

    // Validate fields
    if (field === "certificateTitle" && typeof value === "string") {
      const error = validateCertificateTitle(value);
      setErrors((prev) => ({ ...prev, [`cert-${index}-certificateTitle`]: error }));
    } else if (field === "domain" && typeof value === "string") {
      const error = validateDomain(value);
      setErrors((prev) => ({ ...prev, [`cert-${index}-domain`]: error }));
    } else if (field === "certificateProvidedBy" && typeof value === "string") {
      const error = validateProvider(value);
      setErrors((prev) => ({ ...prev, [`cert-${index}-certificateProvidedBy`]: error }));
    }
  };

  const toggleExpand = (index: number) => {
    const updated = [...certificates];
    updated[index] = {
      ...updated[index],
      isExpanded: !updated[index].isExpanded,
    };
    setCertificates(updated);
  };

  const resetCertificate = (index: number) => {
    const updated = [...certificates];
    updated[index] = {
      ...updated[index],
      certificateType: "",
      certificateTitle: "",
      domain: "",
      certificateProvidedBy: "",
      date: "",
      description: "",
      uploadedFile: null,
      uploadedFileName: "",
    };
    setCertificates(updated);

    // Clear errors for this certificate
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`cert-${index}-certificateTitle`];
      delete newErrors[`cert-${index}-domain`];
      delete newErrors[`cert-${index}-certificateProvidedBy`];
      delete newErrors[`cert-${index}-file`];
      return newErrors;
    });
  };

  const addCertificate = () => {
    setCertificates([
      ...certificates,
      {
        id: Date.now().toString(),
        certificateType: "",
        certificateTitle: "",
        domain: "",
        certificateProvidedBy: "",
        date: "",
        description: "",
        uploadedFile: null,
        uploadedFileName: "",
        isExpanded: true,
      },
    ]);
  };

  const removeCertificate = (index: number) => {
    if (certificates.length > 1) {
      setCertificates(certificates.filter((_, i) => i !== index));
      
      // Clear errors for removed certificate
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`cert-${index}-certificateTitle`];
        delete newErrors[`cert-${index}-domain`];
        delete newErrors[`cert-${index}-certificateProvidedBy`];
        delete newErrors[`cert-${index}-file`];
        return newErrors;
      });
    }
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, [`cert-${index}-file`]: error }));
      return;
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file);

    const updated = [...certificates];
    updated[index] = {
      ...updated[index],
      uploadedFile: file,
      uploadedFileName: file.name,
      uploadedFileUrl: result.url,
      uploadedFileDeleteToken: result.deleteToken,
    };

    setCertificates(updated);

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`cert-${index}-file`];
      return newErrors;
    });
  };


  const handleFileDrop = (
    index: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const error = validateFile(file);
      
      if (error) {
        setErrors((prev) => ({ ...prev, [`cert-${index}-file`]: error }));
        return;
      }

      const updated = [...certificates];
      updated[index] = {
        ...updated[index],
        uploadedFile: file,
        uploadedFileName: file.name,
      };
      setCertificates(updated);
      
      // Clear file error if valid
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`cert-${index}-file`];
        return newErrors;
      });
    }
  };

  const clearFile = async (index: number) => {
    const { uploadedFileDeleteToken } = certificates[index];

    if (uploadedFileDeleteToken) {
      await deleteFromCloudinary(uploadedFileDeleteToken);
    }

    const updated = [...certificates];
    updated[index] = {
      ...updated[index],
      uploadedFile: null,
      uploadedFileName: "",
      uploadedFileUrl: "",
      uploadedFileDeleteToken: "",
    };

    setCertificates(updated);

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`cert-${index}-file`];
      return newErrors;
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ certificates });
  };

  const renderCertificateCard = (certificate: Certificate, index: number) => (
    <div
      key={certificate.id}
      className="bg-white border border-gray-200 rounded-xl mb-4 md:mb-5 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 md:py-4 border-b border-gray-200">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
          Certificate - {index + 1}
        </h3>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => toggleExpand(index)}
            className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ChevronDown
              className={`w-3 h-3 text-gray-600 cursor-pointer transition-transform ${
                !certificate.isExpanded ? "rotate-180" : ""
              }`}
              strokeWidth={2.5}
            />
          </button>
          <button
            type="button"
            onClick={() => resetCertificate(index)}
            className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <RotateCcw
              className="w-3 h-3 text-gray-600 cursor-pointer"
              strokeWidth={2.5}
            />
          </button>
          {certificates.length > 1 && (
            <button
              type="button"
              onClick={() => removeCertificate(index)}
              className="w-5 h-5 flex items-center justify-center rounded border-2 border-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2
                className="w-3 h-3 text-red-500 cursor-pointer"
                strokeWidth={2.5}
              />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {certificate.isExpanded && (
        <div className="p-4 sm:p-5 md:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Certificate Type and Certificate Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Certificate Type */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Certificate Type
                </label>
                <div className="relative">
                  <select
                    value={certificate.certificateType}
                    onChange={(e) =>
                      handleCertificateChange(
                        index,
                        "certificateType",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-xs sm:text-sm appearance-none bg-white pr-8"
                  >
                    <option value="">Select Certificate Type</option>
                    <option value="Course Completion">Course Completion</option>
                    <option value="Professional Certification">
                      Professional Certification
                    </option>
                    <option value="Achievement">Achievement</option>
                    <option value="Training">Training</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Certificate Title */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Certificate Title
                </label>
                <input
                  type="text"
                  value={certificate.certificateTitle}
                  onChange={(e) =>
                    handleCertificateChange(
                      index,
                      "certificateTitle",
                      e.target.value
                    )
                  }
                  placeholder="Enter Certificate Title"
                  className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                    errors[`cert-${index}-certificateTitle`]
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-400 focus:border-transparent"
                  }`}
                />
                {errors[`cert-${index}-certificateTitle`] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[`cert-${index}-certificateTitle`]}
                  </p>
                )}
              </div>
            </div>

            {/* Domain, Certificate Provided By, Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Domain */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Domain
                </label>
                <input
                  type="text"
                  value={certificate.domain}
                  onChange={(e) =>
                    handleCertificateChange(index, "domain", e.target.value)
                  }
                  placeholder="Enter Domain"
                  className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                    errors[`cert-${index}-domain`]
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-400 focus:border-transparent"
                  }`}
                />
                {errors[`cert-${index}-domain`] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[`cert-${index}-domain`]}
                  </p>
                )}
              </div>

              {/* Certificate Provided By */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Certificate Provided By
                </label>
                <input
                  type="text"
                  value={certificate.certificateProvidedBy}
                  onChange={(e) =>
                    handleCertificateChange(
                      index,
                      "certificateProvidedBy",
                      e.target.value
                    )
                  }
                  placeholder="Certificate Provided By"
                  className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                    errors[`cert-${index}-certificateProvidedBy`]
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-400 focus:border-transparent"
                  }`}
                />
                {errors[`cert-${index}-certificateProvidedBy`] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[`cert-${index}-certificateProvidedBy`]}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="month"
                    value={certificate.date}
                    onChange={(e) =>
                      handleCertificateChange(index, "date", e.target.value)
                    }
                    placeholder="Select Date"
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-xs sm:text-sm pr-8"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={certificate.description}
                onChange={(e) =>
                  handleCertificateChange(index, "description", e.target.value)
                }
                placeholder="Provide Description..."
                rows={3}
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-xs sm:text-sm resize-none"
              />
            </div>

            {/* Upload Certificate */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Upload Certificate
              </label>

              {!certificate.uploadedFileName ? (
                <>
                  <div
                    onDrop={(e) => handleFileDrop(index, e)}
                    onDragOver={(e) => e.preventDefault()}
                    className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center hover:border-orange-400 transition-colors cursor-pointer ${
                      errors[`cert-${index}-file`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    onClick={() =>
                      document.getElementById(`file-input-${index}`)?.click()
                    }
                  >
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2 cursor-pointer" />
                    <p className="text-xs sm:text-sm text-gray-600">
                      Drag and drop or upload certificate... (pdf, jpg, jpeg
                      format only)
                    </p>
                    <input
                      id={`file-input-${index}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(index, e)}
                      className="hidden"
                    />
                  </div>
                  {errors[`cert-${index}-file`] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors[`cert-${index}-file`]}
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Upload className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 truncate">
                      {certificate.uploadedFileName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => clearFile(index)}
                    className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4 text-gray-600 cursor-pointer" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
      <div className="max-w-6xl mx-auto">
        {/* Step Header */}
        <div className="mb-4 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1">
            Step 6: Certificates
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Provide certificate details (if any) related to your job role.
          </p>
        </div>

        {/* Certificate Cards */}
        {certificates.map((certificate, index) =>
          renderCertificateCard(certificate, index)
        )}

        {/* Add Certificate Button */}
        <button
          type="button"
          onClick={addCertificate}
          className="flex items-center gap-2 px-4 py-2.5 text-orange-400 hover:text-orange-500 font-medium text-sm transition-colors mb-4 md:mb-5 cursor-pointer"
        >
          <Plus className="w-4 h-4 cursor-pointer" />
          Add Certificate
        </button>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-orange-300 hover:border-orange-400 text-orange-400 rounded-xl font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              background: "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
            }}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-400 hover:bg-orange-700 text-white rounded-xl font-medium text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
}