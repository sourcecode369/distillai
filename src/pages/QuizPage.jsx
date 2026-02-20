import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Loader2, Target } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { dbHelpers } from "../lib/supabase";
import Hero from "../components/Hero";
import { loadTopic } from "../utils/topicLoader";
import { loadCategory } from "../utils/dataLoader";
import { ErrorState } from "../components/EmptyState";
import SEO from "../components/SEO";

const QuizPage = () => {
  const { categoryId, topicId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("quiz");
  const { user } = useAuth();
  const { showToast } = useApp();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch topic data
  const { data: topic, isLoading: loadingTopic, error: topicError } = useQuery({
    queryKey: ["topic", categoryId, topicId],
    queryFn: () => loadTopic(categoryId, topicId),
    enabled: !!categoryId && !!topicId,
  });

  // Fetch category data
  const { data: category, isLoading: loadingCategory, error: categoryError } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => loadCategory(categoryId),
    enabled: !!categoryId,
  });

  const questions = topic?.content?.quiz || [];

  // Mutation for saving quiz results
  const saveQuizResultMutation = useMutation({
    mutationFn: async ({ scorePercentage }) => {
      if (!user?.id || !category?.id || !topic?.id) {
        throw new Error("User, category, or topic not available");
      }
      const { error } = await dbHelpers.updateProgress(user.id, {
        categoryId: category.id,
        topicId: topic.id,
        completed: scorePercentage >= 80, // Mark as completed if score >= 80%
        quizScore: scorePercentage,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate related queries to refresh progress data
      queryClient.invalidateQueries({ queryKey: ["topic-completion", user?.id, category?.id, topic?.id] });
      queryClient.invalidateQueries({ queryKey: ["user-progress", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["user-progress-with-quizzes", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["category-progress", user?.id, category?.id] });
      showToast(t("results.savedSuccess"), "success");
    },
    onError: (error) => {
      console.error("Error saving quiz result:", error);
      showToast(t("results.saveFailed"), "warning");
    },
  });

  if (loadingTopic || loadingCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (topicError || categoryError || !topic || !category) {
    return (
      <ErrorState
        title={t("errors.loadFailed", { defaultValue: "Failed to load quiz" })}
        description={topicError?.message || categoryError?.message || t("errors.loadFailedDescription", { defaultValue: "Unable to load quiz content." })}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    });
  };



  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      showToast(t("validation.answerAll"), "error");
      return;
    }

    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    setScore(correctCount);
    setIsSubmitted(true);

    // Save quiz result to database if user is logged in
    if (user?.id && category?.id && topic?.id) {
      saveQuizResultMutation.mutate({ scorePercentage });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  // Helper function to check if answer is correct (used in results)
  const isAnswerCorrect = (index) => {
    return selectedAnswers[index] === questions[index].correctAnswer;
  };

  const getScorePercentage = () => {
    return Math.round((score / questions.length) * 100);
  };

  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreMessage = () => {
    const percentage = getScorePercentage();
    if (percentage === 100) return t("scoreMessages.perfect");
    if (percentage >= 80) return t("scoreMessages.excellent");
    if (percentage >= 60) return t("scoreMessages.good");
    return t("scoreMessages.keepLearning");
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-gray-900/60 rounded-3xl p-8 shadow-elegant">
            <p className="text-gray-500 mb-6">
              {t("empty.title")}
            </p>
            <button
              onClick={() => navigate(`/topic/${categoryId}/${topicId}`)}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <ArrowLeft size={18} /> {t("empty.backButton")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 pb-12">
      <SEO
        title={`Quiz: ${topic.title}`}
        description={`Test your knowledge of ${topic.title} with our interactive quiz.`}
        url={`/quiz/${categoryId}/${topicId}`}
      />
      <Hero
        title={t("header.title", { title: topic.title })}
        subtitle={t("header.subtitle", { count: questions.length })}
        icon={<Target size={22} className="text-white drop-shadow-sm" />}
        onBack={() => navigate(`/topic/${categoryId}/${topicId}`)}
        backLabel={t("navigation.backToTopic")}
        useArrowLeft={true}
        rightActions={
          !isSubmitted && (
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-gray-500">
                {currentQuestionIndex + 1}/{questions.length}
              </div>
              <div className="w-32 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12 sm:pb-16">
        {!isSubmitted ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Question Navigation */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`min-w-[44px] min-h-[44px] px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all touch-manipulation active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${index === currentQuestionIndex
                    ? "bg-indigo-600 text-white shadow-lg"
                    : selectedAnswers[index] !== undefined
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Current Question */}
            <div className="bg-gray-900/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-elegant hover:shadow-elegant-hover transition-all">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-base sm:text-lg shadow-elegant shadow-indigo-500/30 flex-shrink-0">
                    {currentQuestionIndex + 1}
                  </span>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 dark:text-slate-200 leading-tight break-words">
                    {questions[currentQuestionIndex].question}
                  </h2>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {questions[currentQuestionIndex].options.map((option, optionIndex) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optionIndex;
                  return (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswerSelect(currentQuestionIndex, optionIndex)}
                      className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all min-h-[56px] touch-manipulation active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isSelected
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md"
                        : "border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                        }`}
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 ${isSelected
                            ? "border-indigo-500 bg-indigo-500"
                            : "border-gray-300 dark:border-slate-600"
                            }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium break-words">
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-sm sm:text-base font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {t("navigation.previous")}
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))
                  }
                  className="min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm sm:text-base font-semibold hover:from-indigo-700 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all touch-manipulation active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {t("navigation.next")}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm sm:text-base font-semibold hover:from-indigo-700 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 touch-manipulation active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span>{t("navigation.submit")}</span>
                  <Trophy size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results Page */
          <div className="space-y-4 sm:space-y-6">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-elegant-hover">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">{t("results.title")}</h2>
                  <p className="text-sm sm:text-base text-indigo-100 break-words">{getScoreMessage()}</p>
                  {saveQuizResultMutation.isPending && (
                    <div className="flex items-center gap-2 mt-2 text-indigo-100 text-xs sm:text-sm">
                      <Loader2 size={14} className="animate-spin" />
                      <span>{t("results.saving")}</span>
                    </div>
                  )}
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className={`text-4xl sm:text-5xl font-extrabold ${getScoreColor()}`}>
                    {getScorePercentage()}%
                  </div>
                  <div className="text-indigo-100 text-xs sm:text-sm mt-1">
                    {t("results.scoreOutOf", { score, total: questions.length })}
                  </div>
                </div>
              </div>
              <div className="w-full h-2.5 sm:h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${getScorePercentage()}%` }}
                />
              </div>
            </div>

            {/* Question Review */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                {t("results.reviewTitle")}
              </h3>
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = isAnswerCorrect(index);

                return (
                  <div
                    key={index}
                    className={`bg-gray-900/60 rounded-2xl p-6 shadow-elegant border-2 ${isCorrect
                      ? "border-green-200 dark:border-green-800"
                      : "border-red-200 dark:border-red-800"
                      }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isCorrect
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <XCircle size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            {t("results.questionLabel", { number: index + 1 })}
                          </span>
                          {isCorrect ? (
                            <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                              {t("results.correct")}
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                              {t("results.incorrect")}
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
                          {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => {
                            const isUserAnswer = userAnswer === optionIndex;
                            const isCorrectAnswer = question.correctAnswer === optionIndex;

                            return (
                              <div
                                key={optionIndex}
                                className={`p-3 rounded-lg border-2 ${isCorrectAnswer
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : isUserAnswer && !isCorrect
                                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                    : "border-gray-200 dark:border-slate-700"
                                  }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCorrectAnswer && (
                                    <CheckCircle2
                                      size={18}
                                      className="text-green-600 dark:text-green-400 flex-shrink-0"
                                    />
                                  )}
                                  {isUserAnswer && !isCorrect && (
                                    <XCircle
                                      size={18}
                                      className="text-red-600 dark:text-red-400 flex-shrink-0"
                                    />
                                  )}
                                  <span
                                    className={`font-medium ${isCorrectAnswer
                                      ? "text-green-700 dark:text-green-300"
                                      : isUserAnswer && !isCorrect
                                        ? "text-red-700 dark:text-red-300"
                                        : "text-gray-500"
                                      }`}
                                  >
                                    {option}
                                  </span>
                                  {isCorrectAnswer && (
                                    <span className="ml-auto px-2 py-1 rounded text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                      {t("results.correctAnswer")}
                                    </span>
                                  )}
                                  {isUserAnswer && !isCorrect && (
                                    <span className="ml-auto px-2 py-1 rounded text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                      {t("results.yourAnswer")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {question.explanation && (
                          <div className="mt-4 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                            <p className="text-sm text-indigo-700 dark:text-indigo-300">
                              <strong className="font-semibold">{t("results.explanation")}</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all flex items-center gap-2"
              >
                <RotateCcw size={18} /> {t("results.retakeQuiz")}
              </button>
              <button
                onClick={() => navigate(`/topic/${categoryId}/${topicId}`)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-700 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all"
              >
                {t("results.backToTopic")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

QuizPage.propTypes = {
};

export default QuizPage;

