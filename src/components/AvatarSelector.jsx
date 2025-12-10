import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Upload, Link, Image as ImageIcon, X, Loader2, Check } from "lucide-react";
import { storageHelpers } from "../lib/supabase";

// Predefined avatar options - 30 avatars with variety (humans, animals, weird stuff)
const PREDEFINED_AVATARS = [
  // Human avatars (10)
  { id: "avatar-1", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar1", name: "Person 1" },
  { id: "avatar-2", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar2", name: "Person 2" },
  { id: "avatar-3", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar3", name: "Person 3" },
  { id: "avatar-4", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar4", name: "Person 4" },
  { id: "avatar-5", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar5", name: "Person 5" },
  { id: "avatar-6", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar6", name: "Person 6" },
  { id: "avatar-7", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar7", name: "Person 7" },
  { id: "avatar-8", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar8", name: "Person 8" },
  { id: "avatar-9", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar9", name: "Person 9" },
  { id: "avatar-10", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar10", name: "Person 10" },
  // Animals (10)
  { id: "avatar-11", url: "https://api.dicebear.com/7.x/bottts/svg?seed=cat", name: "Cat Bot" },
  { id: "avatar-12", url: "https://api.dicebear.com/7.x/bottts/svg?seed=dog", name: "Dog Bot" },
  { id: "avatar-13", url: "https://api.dicebear.com/7.x/bottts/svg?seed=bear", name: "Bear Bot" },
  { id: "avatar-14", url: "https://api.dicebear.com/7.x/bottts/svg?seed=lion", name: "Lion Bot" },
  { id: "avatar-15", url: "https://api.dicebear.com/7.x/bottts/svg?seed=tiger", name: "Tiger Bot" },
  { id: "avatar-16", url: "https://api.dicebear.com/7.x/bottts/svg?seed=wolf", name: "Wolf Bot" },
  { id: "avatar-17", url: "https://api.dicebear.com/7.x/bottts/svg?seed=rabbit", name: "Rabbit Bot" },
  { id: "avatar-18", url: "https://api.dicebear.com/7.x/bottts/svg?seed=fox", name: "Fox Bot" },
  { id: "avatar-19", url: "https://api.dicebear.com/7.x/bottts/svg?seed=panda", name: "Panda Bot" },
  { id: "avatar-20", url: "https://api.dicebear.com/7.x/bottts/svg?seed=elephant", name: "Elephant Bot" },
  // Weird/Creative (10)
  { id: "avatar-21", url: "https://api.dicebear.com/7.x/shapes/svg?seed=weird1", name: "Shape 1" },
  { id: "avatar-22", url: "https://api.dicebear.com/7.x/shapes/svg?seed=weird2", name: "Shape 2" },
  { id: "avatar-23", url: "https://api.dicebear.com/7.x/shapes/svg?seed=weird3", name: "Shape 3" },
  { id: "avatar-24", url: "https://api.dicebear.com/7.x/shapes/svg?seed=weird4", name: "Shape 4" },
  { id: "avatar-25", url: "https://api.dicebear.com/7.x/shapes/svg?seed=weird5", name: "Shape 5" },
  { id: "avatar-26", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=weird6", name: "Pixel 1" },
  { id: "avatar-27", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=weird7", name: "Pixel 2" },
  { id: "avatar-28", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=weird8", name: "Pixel 3" },
  { id: "avatar-29", url: "https://api.dicebear.com/7.x/identicon/svg?seed=weird9", name: "Icon 1" },
  { id: "avatar-30", url: "https://api.dicebear.com/7.x/identicon/svg?seed=weird10", name: "Icon 2" },
];

const AvatarSelector = ({ userId, currentAvatar, onAvatarChange, onClose, isOpen }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("upload"); // "upload", "predefined", "url"
  const [uploading, setUploading] = useState(false);
  const [selectedPredefined, setSelectedPredefined] = useState(null);
  const [urlValue, setUrlValue] = useState(currentAvatar || "");
  const [urlError, setUrlError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUrlError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUrlError("Image size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      setUrlError("");

      const { data, error } = await storageHelpers.uploadAvatar(userId, file);

      if (error) {
        console.error("Upload error:", error);
        setUrlError("Failed to upload image. Please try again.");
        return;
      }

      if (data?.url) {
        onAvatarChange(data.url);
        onClose();
      }
    } catch (error) {
      console.error("Upload exception:", error);
      setUrlError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePredefinedSelect = (avatar) => {
    setSelectedPredefined(avatar.id);
    onAvatarChange(avatar.url);
    // Auto-close after a brief delay to show selection
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleUrlSubmit = () => {
    if (!urlValue.trim()) {
      setUrlError("Please enter a URL");
      return;
    }

    // Validate URL
    try {
      new URL(urlValue);
      setUrlError("");
      onAvatarChange(urlValue);
      onClose();
    } catch {
      setUrlError("Please enter a valid URL");
    }
  };

  const handleRemoveAvatar = () => {
    onAvatarChange("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Change Avatar
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === "upload"
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Upload size={18} />
              Upload Image
            </div>
          </button>
          <button
            onClick={() => setActiveTab("predefined")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === "predefined"
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ImageIcon size={18} />
              Choose Avatar
            </div>
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === "url"
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Link size={18} />
              Enter URL
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
                      <p className="text-slate-600 dark:text-slate-400">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-slate-50 font-semibold mb-1">
                          Click to upload an image
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </>
                  )}
                </label>
              </div>
              {urlError && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {urlError}
                </p>
              )}
            </div>
          )}

          {/* Predefined Avatars Tab */}
          {activeTab === "predefined" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">
                Choose from our collection of avatars (scroll to see more)
              </p>
              <div className="grid grid-cols-5 gap-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {PREDEFINED_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handlePredefinedSelect(avatar)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${selectedPredefined === avatar.id
                      ? "border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/50"
                      : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600"
                      }`}
                  >
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedPredefined === avatar.id && (
                      <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                        <Check className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* URL Tab */}
          {activeTab === "url" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="avatar-url"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                >
                  Avatar URL
                </label>
                <input
                  type="url"
                  id="avatar-url"
                  value={urlValue}
                  onChange={(e) => {
                    setUrlValue(e.target.value);
                    setUrlError("");
                  }}
                  placeholder="https://example.com/avatar.jpg"
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${urlError
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                    }`}
                />
                {urlError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {urlError}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Enter a direct URL to an image file
                </p>
              </div>
              <button
                onClick={handleUrlSubmit}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Use This URL
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <button
            onClick={handleRemoveAvatar}
            className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-semibold transition-colors"
          >
            Remove Avatar
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

AvatarSelector.propTypes = {
  userId: PropTypes.string.isRequired,
  currentAvatar: PropTypes.string,
  onAvatarChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default AvatarSelector;

