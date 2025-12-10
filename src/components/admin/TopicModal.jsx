import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { X, Save, Loader2, AlertCircle, FileText, CheckCircle2, Database } from "lucide-react";
import { loadAllCategories } from "../../utils/dataLoader";
import { dbHelpers } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import Button from "../Button";
import ContentEditor from "./ContentEditor";

const TopicModal = ({ isOpen, onClose, topic, categoryId, onSave }) => {
  const { t } = useTranslation("admin");
  const { user } = useAuth();
  const { showToast } = useApp();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Beginner",
    readTime: "5 min read",
    tags: [],
    categoryId: categoryId || "",
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [contentData, setContentData] = useState({});
  const [dismissBanner, setDismissBanner] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [highlightedTagIndex, setHighlightedTagIndex] = useState(-1);
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const tagInputRef = useRef(null);
  const tagDropdownRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  // Get all existing tags for autocomplete from database topics
  const [allTags, setAllTags] = useState([]);

  // Load categories when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        const cats = await loadAllCategories();
        setCategories(cats || []);
      };
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchTags = async () => {
      const { data: topics } = await dbHelpers.getAllTopics();
      if (topics) {
        const tags = Array.from(
          new Set(
            topics.flatMap((t) => t.tags || [])
          )
        ).sort();
        setAllTags(tags);
      }
    };
    fetchTags();
  }, []);

  // Calculate content metrics
  const getContentMetrics = () => {
    if (!contentData || Object.keys(contentData).length === 0) {
      return null;
    }
    const sections = contentData.sections?.length || 0;
    const images = contentData.sections?.reduce(
      (acc, s) => acc + (s.image ? 1 : 0),
      0
    ) || 0;
    const codeBlocks = contentData.sections?.reduce(
      (acc, s) => acc + (s.code ? 1 : 0),
      0
    ) || 0;
    const equations = contentData.sections?.reduce(
      (acc, s) => acc + (s.equations?.length || 0),
      0
    ) || 0;
    const quiz = contentData.quiz?.length || 0;

    const parts = [];
    if (sections > 0) parts.push(`${sections} section${sections !== 1 ? "s" : ""}`);
    if (images > 0) parts.push(`${images} image${images !== 1 ? "s" : ""}`);
    if (codeBlocks > 0) parts.push(`${codeBlocks} code block${codeBlocks !== 1 ? "s" : ""}`);
    if (equations > 0) parts.push(`${equations} equation${equations !== 1 ? "s" : ""}`);
    if (quiz > 0) parts.push(`${quiz} quiz question${quiz !== 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(" • ") : null;
  };

  useEffect(() => {
    if (topic) {
      setFormData({
        title: topic.title || "",
        description: topic.description || "",
        difficulty: topic.difficulty || "Beginner",
        readTime: topic.readTime || "5 min read",
        tags: topic.tags || [],
        categoryId: topic.categoryId || categoryId || "",
      });
      setContentData(topic.content || {});
    } else {
      setFormData({
        title: "",
        description: "",
        difficulty: "Beginner",
        readTime: "5 min read",
        tags: [],
        categoryId: categoryId || "",
      });
      setContentData({});
    }
    setTagInput("");
    setErrors({});
    setShowContentEditor(false);
    setSaved(false);
    setDismissBanner(false);
  }, [topic, categoryId, isOpen]);

  // Focus management and trap
  useEffect(() => {
    if (isOpen) {
      // Store the element that had focus before modal opened
      previousActiveElementRef.current = document.activeElement;

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Focus the first focusable element
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 100);

      // Handle Escape key
      const handleEscape = (e) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      // Handle Tab key for focus trapping
      const handleTab = (e) => {
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleTab);

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("keydown", handleTab);
        document.body.style.overflow = "";

        // Return focus to the element that had focus before modal opened
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  // Handle Enter key (submit form, except in textarea)
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter" && isOpen && !saving) {
        const target = e.target;
        if (
          target.tagName !== "TEXTAREA" &&
          !target.closest(".content-editor") &&
          formRef.current
        ) {
          e.preventDefault();
          formRef.current.requestSubmit();
        }
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEnter);
      return () => document.removeEventListener("keydown", handleEnter);
    }
  }, [isOpen, saving]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleAddTag = (tagToAdd = null) => {
    const tag = tagToAdd || tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
      setShowTagDropdown(false);
      setHighlightedTagIndex(-1);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Filter available tags based on input
  const filteredTags = allTags.filter(
    (tag) =>
      !formData.tags.includes(tag) &&
      tag.toLowerCase().includes(tagInput.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tagInputRef.current &&
        !tagInputRef.current.contains(event.target) &&
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target)
      ) {
        setShowTagDropdown(false);
        setHighlightedTagIndex(-1);
      }
    };

    if (showTagDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showTagDropdown]);

  // Handle keyboard navigation in dropdown
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedTagIndex >= 0 && filteredTags[highlightedTagIndex]) {
        handleAddTag(filteredTags[highlightedTagIndex]);
      } else if (tagInput.trim()) {
        handleAddTag();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setShowTagDropdown(true);
      setHighlightedTagIndex((prev) =>
        prev < filteredTags.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedTagIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowTagDropdown(false);
      setHighlightedTagIndex(-1);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = t("content.modals.topicForm.errors.titleRequired");
    }
    if (!formData.description.trim()) {
      newErrors.description = t("content.modals.topicForm.errors.descriptionRequired");
    }
    if (!formData.categoryId) {
      newErrors.categoryId = t("content.modals.topicForm.errors.categoryRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast(t("content.modals.topicForm.errors.fixErrors"), "error");
      return;
    }

    setSaving(true);
    setSaved(false);
    try {
      const topicPayload = {
        categoryId: formData.categoryId,
        topicId: topic?.topic_id || topic?.id || `topic-${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
        readTime: formData.readTime,
        tags: formData.tags,
        content: contentData || topic?.content || { sections: [] },
      };

      let result;
      if (topic && topic.id && typeof topic.id === "string" && topic.id.length === 36) {
        result = await dbHelpers.updateTopic(topic.id, topicPayload);
      } else if (topic && topic.categoryId && (topic.topic_id || topic.id)) {
        const topicIdToCheck = topic.topic_id || topic.id;
        const { data: existingTopic, error: checkError } = await dbHelpers.getTopic(
          topic.categoryId,
          topicIdToCheck
        );

        if (existingTopic && !checkError) {
          result = await dbHelpers.updateTopic(existingTopic.id, topicPayload);
        } else {
          topicPayload.topicId = topicIdToCheck;
          topicPayload.is_custom = false;
          result = await dbHelpers.createTopic(topicPayload);
        }
      } else {
        result = await dbHelpers.createTopic(topicPayload);
      }

      if (result.error) {
        console.error("Error saving topic:", result.error);
        showToast(
          result.error.message || t("errors.saveFailed"),
          "error"
        );
        return;
      }

      if (!result.data) {
        // Handle case where update succeeded but returned no data (e.g. RLS)
        // We can't update the UI with new data, but we can assume success if no error
        console.warn("Update returned no data (check RLS policies)");

        // If we have the original topic data, we can try to use that + changes
        // But safer to just notify user
        showToast(
          t("content.modals.topicForm.success.updated") + " (Reload to see changes)",
          "success"
        );
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        await onSave({ ...topic, ...topicPayload, id: topic.id }, topic ? "update" : "create");
        return;
      }

      const savedTopic = {
        id: result.data.id,
        categoryId: result.data.category_id,
        topicId: result.data.topic_id,
        title: result.data.title,
        description: result.data.description,
        difficulty: result.data.difficulty,
        readTime: result.data.read_time,
        tags: result.data.tags || [],
        categoryTitle: categories.find((c) => c.category_id === result.data.category_id)?.title || "",
        content: result.data.content || {},
        is_custom: result.data.is_custom,
      };

      setSaved(true);
      showToast(
        topic ? t("content.modals.topicForm.success.updated") : t("content.modals.topicForm.success.created"),
        "success"
      );

      // Reset saved state after 2 seconds
      setTimeout(() => setSaved(false), 2000);

      await onSave(savedTopic, topic ? "update" : "create");
    } catch (error) {
      console.error("Error saving topic:", error);
      showToast(t("errors.unexpectedError"), "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const categoryTitle = categories.find((c) => c.category_id === formData.categoryId)?.title || "";
  const topicId = topic?.topic_id || topic?.id || "";
  const contentMetrics = getContentMetrics();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="topic-modal-title"
      aria-describedby="topic-modal-description"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-900/50">
          <div className="flex-1">
            <h2 id="topic-modal-title" className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">
              {topic ? t("content.modals.topicForm.editTitle") : t("content.modals.topicForm.addTitle")}
            </h2>
            {topic && (
              <p id="topic-modal-description" className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                {categoryTitle && `${categoryTitle} · `}
                {topicId && `${t("content.modals.topicForm.topicIdLabel")} ${topicId}`}
              </p>
            )}
            {!topic && (
              <p id="topic-modal-description" className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                {t("content.modals.topicForm.createDescription")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            aria-label={t("common.close")}
          >
            <X size={20} className="text-slate-600 dark:text-slate-400" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6">
            {/* Database Banner */}
            {!dismissBanner && (
              <div className="mb-5 p-3.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-start gap-3">
                <Database size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                    {t("common.savedToDatabase")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDismissBanner(true)}
                  className="p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                  aria-label={t("common.dismissBanner")}
                >
                  <X size={16} className="text-indigo-600 dark:text-indigo-400" />
                </button>
              </div>
            )}

            {/* Two-column layout on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Basic Info + Meta */}
              <div className="space-y-5">
                {/* Basic Info Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                    {t("content.modals.topicForm.basicInfo")}
                  </h3>
                  <div className="space-y-4">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t("content.modals.topicForm.categoryLabel")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleInputChange}
                          disabled={!!topic}
                          className={`w-full px-4 py-2.5 pr-10 border rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 transition-all text-sm shadow-sm hover:shadow-md appearance-none ${errors.categoryId
                              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                              : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-700"
                            } ${topic ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <option value="" className="text-slate-500 dark:text-slate-400">{t("content.modals.topicForm.selectCategory")}</option>
                          {categories.map((cat) => (
                            <option key={cat.category_id} value={cat.category_id} className="text-slate-900 dark:text-slate-50">
                              {cat.title}
                            </option>
                          ))}
                        </select>
                        {!topic && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.categoryId && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.categoryId}</p>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t("content.modals.topicForm.titleLabel")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder={t("content.modals.topicForm.titlePlaceholder")}
                        className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all text-sm ${errors.title
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                          }`}
                      />
                      {errors.title && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t("content.modals.topicForm.descriptionLabel")} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder={t("content.modals.topicForm.descriptionPlaceholder")}
                        rows={3}
                        className={`w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all resize-none text-sm ${errors.description
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                          }`}
                      />
                      {errors.description && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meta Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                    {t("content.modals.topicForm.meta")}
                  </h3>
                  <div className="space-y-4">
                    {/* Difficulty and Read Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t("content.modals.topicForm.difficultyLabel")}
                        </label>
                        <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all text-sm"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t("content.modals.topicForm.readTimeLabel")}
                        </label>
                        <input
                          type="text"
                          name="readTime"
                          value={formData.readTime}
                          onChange={handleInputChange}
                          placeholder={t("content.modals.topicForm.readTimePlaceholder")}
                          className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all text-sm"
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {t("content.modals.topicForm.readTimeHelp")}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t("content.modals.topicForm.tagsLabel")}
                      </label>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="relative flex-1" ref={tagInputRef}>
                          <input
                            ref={tagInputRef}
                            type="text"
                            value={tagInput}
                            onChange={(e) => {
                              setTagInput(e.target.value);
                              setShowTagDropdown(true);
                              setHighlightedTagIndex(-1);
                            }}
                            onFocus={() => {
                              if (filteredTags.length > 0) {
                                setShowTagDropdown(true);
                              }
                            }}
                            onKeyDown={handleTagInputKeyDown}
                            placeholder={t("content.modals.topicForm.addTagPlaceholder")}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all text-sm shadow-sm"
                          />
                          {/* Custom Dropdown */}
                          {showTagDropdown && filteredTags.length > 0 && (
                            <div
                              ref={tagDropdownRef}
                              className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg max-h-[240px] overflow-y-auto"
                            >
                              <div className="py-1">
                                {filteredTags.map((tag, index) => (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleAddTag(tag)}
                                    className={`w-full text-left px-4 py-2 text-sm text-slate-900 dark:text-slate-50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors ${index === highlightedTagIndex
                                        ? "bg-indigo-50 dark:bg-indigo-900/20"
                                        : ""
                                      }`}
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleAddTag}
                          className="shrink-0"
                        >
                          {t("content.modals.topicForm.addTag")}
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        {t("content.modals.topicForm.pressEnterToAdd")}
                      </p>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2.5">
                          {formData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all border border-indigo-200 dark:border-indigo-800/50"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800/50 p-0.5"
                                aria-label={`Remove ${tag} tag`}
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Content */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                  {t("content.modals.topicForm.content")}
                </h3>
                <div className="space-y-4">
                  {!showContentEditor && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      {contentMetrics ? (
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            {t("content.modals.topicForm.contentSummary")}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {contentMetrics}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {t("content.modals.topicForm.noContentYet")}
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowContentEditor(true)}
                        icon={FileText}
                        iconPosition="left"
                        className="w-full"
                      >
                        {t("content.modals.topicForm.editContent")}
                      </Button>
                    </div>
                  )}

                  {showContentEditor && (
                    <div className="content-editor">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("content.modals.topicForm.contentEditor")}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowContentEditor(false)}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {t("content.modals.topicForm.hideEditor")}
                        </button>
                      </div>
                      <ContentEditor
                        content={contentData}
                        onChange={(newContent) => setContentData(newContent)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={saving}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
            disabled={saving}
            isLoading={saving}
            icon={saved ? CheckCircle2 : saving ? undefined : Save}
            iconPosition="left"
          >
            {saved
              ? t("content.modals.topicForm.saved")
              : saving
                ? t("content.modals.topicForm.saving")
                : topic
                  ? t("content.modals.topicForm.updateTopic")
                  : t("content.modals.topicForm.createTopic")}
          </Button>
        </div>
      </div>
    </div>
  );
};

TopicModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  topic: PropTypes.shape({
    id: PropTypes.string,
    topic_id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    difficulty: PropTypes.string,
    readTime: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    categoryId: PropTypes.string,
    content: PropTypes.object,
  }),
  categoryId: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

export default TopicModal;
