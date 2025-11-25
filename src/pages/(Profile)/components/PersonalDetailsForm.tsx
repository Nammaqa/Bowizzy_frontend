import React, { useState, useRef } from "react";
import { ChevronDown, RotateCcw, X } from "lucide-react";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { deleteFromCloudinary } from "@/utils/deleteFromCloudinary";

interface PersonalDetailsFormProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}

export default function PersonalDetailsForm({
  onNext,
  onBack,
  initialData = {},
}: PersonalDetailsFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    middleName: initialData.middleName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    mobileNumber: initialData.mobileNumber || "",
    dateOfBirth: initialData.dateOfBirth || "",
    gender: initialData.gender || "Male",
    languages: initialData.languages || ["Kannada", "Hindi", "English"],
    address: initialData.address || "",
    country: initialData.country || "",
    state: initialData.state || "",
    city: initialData.city || "",
    pincode: initialData.pincode || "",
    nationality: initialData.nationality || "",
    passportNumber: initialData.passportNumber || "",
    uploadedPhotoURL: initialData.uploadedPhotoURL || "",
    uploadedPublicId: initialData.uploadedPublicId || "",
    profilePhoto: initialData.profilePhoto || null,
    profilePhotoPreview: initialData.profilePhotoPreview || "",
    uploadedDeleteToken: initialData.uploadedDeleteToken || "",


  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newLanguage, setNewLanguage] = useState("");
  const [personalDetailsExpanded, setPersonalDetailsExpanded] = useState(true);
  const [currentLocationExpanded, setCurrentLocationExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation functions
  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (value && !/^[a-zA-Z\s]+$/.test(value)) {
          error = "Only letters allowed";
        }
        break;

      case "middleName":
        if (value && !/^[a-zA-Z\s]+$/.test(value)) {
          error = "Only letters allowed";
        }
        break;

      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;

      case "mobileNumber":
        if (value && !/^\d{0,10}$/.test(value)) {
          error = "Only 10 digits allowed";
        } else if (value && value.length > 0 && value.length < 10) {
          error = "Must be 10 digits";
        }
        break;

      case "pincode":
        if (value && !/^\d{0,6}$/.test(value)) {
          error = "Only 6 digits allowed";
        } else if (value && value.length > 0 && value.length < 6) {
          error = "Must be 6 digits";
        }
        break;

      case "passportNumber":
        if (value && !/^[A-Z0-9]*$/.test(value)) {
          error = "Only uppercase letters and numbers";
        }
        break;
    }

    return error;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    
    // Special handling for mobile number and pincode
    if (name === "mobileNumber" && value.length > 10) return;
    if (name === "pincode" && value.length > 6) return;
    if (name === "passportNumber") {
      const upperValue = value.toUpperCase();
      setFormData((prev) => ({ ...prev, [name]: upperValue }));
      const error = validateField(name, upperValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    const prev = formData.profilePhotoPreview;
    if (prev && typeof prev === "string" && prev.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(prev);
      } catch {
        /* ignore */
      }
    }

    const cloudinaryRes = await uploadToCloudinary(file);

    setFormData((prev) => ({
      ...prev,
      profilePhoto: file,
      profilePhotoPreview: previewURL,
      uploadedPhotoURL: cloudinaryRes.url,
      uploadedPublicId: cloudinaryRes.publicId,
      uploadedDeleteToken: cloudinaryRes.deleteToken || "",
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };




  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddLanguage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newLanguage.trim()) {
      e.preventDefault();
      if (!formData.languages.includes(newLanguage.trim())) {
        setFormData((prev) => ({
          ...prev,
          languages: [...prev.languages, newLanguage.trim()],
        }));
      }
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang: string) => lang !== languageToRemove),
    }));
  };

  const handleClearPersonalDetails = () => {
    setFormData((prev) => ({
      ...prev,
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      dateOfBirth: "",
      gender: "Male",
      languages: [],
      profilePhoto: null,
    }));
    setErrors({});
  };

  const handleClearCurrentLocation = () => {
    setFormData((prev) => ({
      ...prev,
      address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      nationality: "",
      passportNumber: "",
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.pincode;
      delete newErrors.passportNumber;
      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Step Header */}
        <div className="mb-4 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1">
            Step 1: Personal Details
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Add your educational background (SSLC and PUC details are not
            mandatory but included)
          </p>
        </div>

        {/* Personal Details Section */}
        <div className="bg-white border border-gray-200 rounded-xl mb-4 md:mb-5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 md:py-4 border-b border-gray-200">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
              Personal Details
            </h3>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() =>
                  setPersonalDetailsExpanded(!personalDetailsExpanded)
                }
                className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ChevronDown
                  className={`w-3 h-3 text-gray-600 cursor-pointer transition-transform ${
                    !personalDetailsExpanded ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.5}
                />
              </button>
              <button
                type="button"
                onClick={handleClearPersonalDetails}
                className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-600 hover:bg-gray-100 transition-colors"
              >
                <RotateCcw
                  className="w-3 h-3 text-gray-600 cursor-pointer"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>

          {/* Content */}
          {personalDetailsExpanded && (
            <div className="p-4 sm:p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
                {/* Profile Photo */}
                <div className="md:col-span-3 flex justify-center md:justify-start">
                  <div className="flex flex-col items-center">
                    <div
                      onClick={handlePhotoClick}
                      className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-orange-400 transition-colors group"
                    >
                      {formData.profilePhoto ? (
                        <>
                          

                          <img
                            src={
                              formData.profilePhotoPreview ||
                              (typeof formData.profilePhoto === "string" 
                                ? `/uploads/${formData.profilePhoto}`
                                : "")
                            }

                            className="w-full h-full object-cover"
                          />


                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();

                              if (formData.uploadedDeleteToken) {
                                await deleteFromCloudinary(formData.uploadedDeleteToken);
                              } else {
                                console.warn("No delete token available — cannot delete on Cloudinary from FE");
                              }

                              // Revoke preview URL if it was an object URL
                              try {
                                const prev = formData.profilePhotoPreview;
                                if (prev && typeof prev === "string" && prev.startsWith("blob:")) {
                                  URL.revokeObjectURL(prev);
                                }
                              } catch (e) {
                                console.warn('Failed to revoke object URL', e);
                              }

                              setFormData((prev) => ({
                                ...prev,
                                profilePhoto: null,
                                profilePhotoPreview: "",
                                uploadedPhotoURL: "",
                                uploadedPublicId: "",
                                uploadedDeleteToken: "",
                              }));

                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 z-10"
                          >
                            <X className="w-3.5 h-3.5 text-red-500 cursor-pointer" />
                          </button>
                        </>
                      ) : (
                        <svg
                          className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400 group-hover:text-orange-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handlePhotoClick}
                      className="mt-2 text-xs sm:text-sm text-gray-700 hover:text-orange-400 font-medium transition-colors"
                    >
                      Upload Profile Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Aarav"
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                        errors.firstName
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-orange-400 focus:border-transparent"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      placeholder="Enter Middle Name"
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                        errors.middleName
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-orange-400 focus:border-transparent"
                      }`}
                    />
                    {errors.middleName && (
                      <p className="mt-1 text-xs text-red-500">{errors.middleName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Mehta"
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                        errors.lastName
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-orange-400 focus:border-transparent"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="aarav@gmail.com"
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                        errors.email
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-orange-400 focus:border-transparent"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value="+91"
                        disabled
                        className="w-12 sm:w-14 px-2 py-2 sm:py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-xs sm:text-sm text-center"
                      />
                      <div className="flex-1">
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          placeholder="8 8 8 8 8  8 8 8 8 8"
                          maxLength={10}
                          className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm tracking-wider ${
                            errors.mobileNumber
                              ? "border-red-500 focus:ring-red-400"
                              : "border-gray-300 focus:ring-orange-400 focus:border-transparent"
                          }`}
                        />
                      </div>
                    </div>
                    {errors.mobileNumber && (
                      <p className="mt-1 text-xs text-red-500">{errors.mobileNumber}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-xs sm:text-sm"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-xs sm:text-sm appearance-none bg-white pr-8"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Languages Known */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Language Known
                    </label>
                    <div className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-transparent min-h-[38px] sm:min-h-[42px]">
                      <div className="flex flex-wrap gap-2 items-center">
                        {formData.languages.map((lang: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded-md text-xs sm:text-sm"
                          >
                            {lang}
                            <button
                              type="button"
                              onClick={() => handleRemoveLanguage(lang)}
                              className="hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 cursor-pointer" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          onKeyDown={handleAddLanguage}
                          placeholder="Add Language known to you..."
                          className="flex-1 min-w-[150px] sm:min-w-[200px] outline-none text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Location Section */}
        <div className="bg-white border border-gray-200 rounded-xl mb-4 md:mb-5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 md:py-4 border-b border-gray-200">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
              Current Location
            </h3>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => setCurrentLocationExpanded(!currentLocationExpanded)}
                className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ChevronDown
                  className={`w-3 h-3 text-gray-600 cursor-pointer transition-transform ${
                    !currentLocationExpanded ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.5}
                />
              </button>
              <button
                type="button"
                onClick={handleClearCurrentLocation}
                className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-600 hover:bg-gray-100 transition-colors"
              >
                <RotateCcw
                  className="w-3 h-3 text-gray-600 cursor-pointer"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>

                {/* Content */}
                {currentLocationExpanded && (
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

                {/* Address */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    rows={3}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Country
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-xs sm:text-sm appearance-none bg-white pr-8"
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    State
                  </label>
                  <div className="relative">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-xs sm:text-sm appearance-none bg-white pr-8"
                    >
                      <option value="">Select State</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    City
                  </label>
                  <div className="relative">
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-xs sm:text-sm appearance-none bg-white pr-8"
                    >
                      <option value="">Select City</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter Pin code"
                    maxLength={6}
                    className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                      errors.pincode
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-orange-400 focus:border-transparent"
                    }`}
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>
                  )}
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Nationality
                  </label>
                  <div className="relative">
                    <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-xs sm:text-sm appearance-none bg-white pr-8"
                    >
                      <option value="">Select Nationality</option>
                      <option value="Indian">Indian</option>
                      <option value="American">American</option>
                      <option value="British">British</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Passport Number */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    placeholder="Enter Passport Number"
                    className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                      errors.passportNumber
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-orange-400 focus:border-transparent"
                    }`}
                  />
                  {errors.passportNumber && (
                    <p className="mt-1 text-xs text-red-500">{errors.passportNumber}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            type="submit"
            style={{
              background: "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
            }}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-medium text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
          >
            Proceed to next
          </button>
        </div>
      </div>
    </form>
  );
}
