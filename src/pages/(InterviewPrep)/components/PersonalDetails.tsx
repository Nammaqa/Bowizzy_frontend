

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { useRef } from "react";

interface PersonalDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
}

const PersonalDetails = ({ formData, setFormData, onNext }: PersonalDetailsProps) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setFormData({ ...formData, photo: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setFormData({ ...formData, photo: null });
    // clear file input value so selecting same file works again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-md p-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Photo Upload */}
        <div className="flex items-start gap-4">
          <div className="relative w-32 h-32 bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
            {photoPreview ? (
              <>
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <Upload size={32} className="text-gray-400 mb-2" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#3A3A3A] mb-1">
              Upload Photo
            </p>
            <p className="text-xs text-gray-500">Upload a professional photo</p>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName || ""}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="Aarav"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName || ""}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Mehta"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
            />
          </div>
        </div>

        {/* Email and Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="aarav.m@gmail.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value="+91"
                disabled
                className="w-16 px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-center"
              />
              <input
                type="tel"
                value={formData.mobile || ""}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                placeholder="8 8 8 8 8   8 8 8 8 8"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* LinkedIn Profile */}
        <div>
          <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
            LinkedIn Profile URL
          </label>
          <input
            type="url"
            value={formData.linkedin || ""}
            onChange={(e) =>
              setFormData({ ...formData, linkedin: e.target.value })
            }
            placeholder="https://www.linkedin.com/in/aarav-mehta/"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
          />
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onNext}
            className="px-6 py-2.5 rounded-md text-white font-semibold transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
            }}
          >
            Proceed to next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;