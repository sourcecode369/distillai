import React from "react";
import PropTypes from "prop-types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { dbHelpers } from "../lib/supabase";
import Button from "./Button";

/**
 * MarkAsCompleteButton Component
 * 
 * Allows users to mark topics as completed/uncompleted
 * Shows completion state with visual feedback
 */
const MarkAsCompleteButton = ({ categoryId, topicId, onCompleteChange }) => {
  const { user } = useAuth();
  const { showToast } = useApp();
  const queryClient = useQueryClient();

  // Fetch current completion status using React Query
  const {
    data: completionData,
    isLoading,
  } = useQuery({
    queryKey: ["topic-completion", user?.id, categoryId, topicId],
    queryFn: async () => {
      if (!user?.id || !categoryId || !topicId) return { completed: false };
      const { data, error } = await dbHelpers.getUserProgress(
        user.id,
        categoryId,
        topicId
      );
      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" which is fine
        console.error("Error fetching completion status:", error);
        return { completed: false };
      }
      return { completed: data?.completed || false };
    },
    enabled: !!user?.id && !!categoryId && !!topicId,
  });

  const isCompleted = completionData?.completed || false;

  // Mutation for toggling completion status
  const toggleCompleteMutation = useMutation({
    mutationFn: async (completed) => {
      const { error } = await dbHelpers.updateProgress(user.id, {
        categoryId,
        topicId,
        completed,
      });
      if (error) throw error;
      return completed;
    },
    onMutate: async (completed) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["topic-completion", user?.id, categoryId, topicId] });
      
      // Snapshot previous value for optimistic update
      const previousData = queryClient.getQueryData(["topic-completion", user?.id, categoryId, topicId]);
      
      // Optimistically update
      queryClient.setQueryData(["topic-completion", user?.id, categoryId, topicId], { completed });
      
      // Notify parent immediately for instant UI feedback
      if (onCompleteChange) {
        onCompleteChange(completed);
      }
      
      return { previousData };
    },
    onSuccess: (completed) => {
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["topic-completion", user?.id, categoryId, topicId] });
      queryClient.invalidateQueries({ queryKey: ["user-progress", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["user-progress-with-quizzes", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["category-progress", user?.id, categoryId] });
      
      showToast(
        completed 
          ? "Topic marked as complete! ✓" 
          : "Topic marked as incomplete",
        "success"
      );
    },
    onError: (error, completed, context) => {
      // Revert optimistic update on error
      if (context?.previousData) {
        queryClient.setQueryData(["topic-completion", user?.id, categoryId, topicId], context.previousData);
      }
      
      // Notify parent of revert
      if (onCompleteChange) {
        onCompleteChange(!completed);
      }
      
      console.error("Error updating completion status:", error);
      showToast("Failed to update. Please try again.", "error");
    },
  });

  const handleToggleComplete = () => {
    if (!user?.id) {
      showToast("Please sign in to mark topics as complete", "info");
      return;
    }

    toggleCompleteMutation.mutate(!isCompleted);
  };

  if (isLoading || toggleCompleteMutation.isPending) {
    return (
      <Button
        variant="secondary"
        size="sm"
        disabled
        icon={Loader2}
        className="animate-pulse"
      >
        Loading...
      </Button>
    );
  }

  if (!user?.id) {
    return null; // Don't show button if user is not signed in
  }

  return (
    <Button
      variant={isCompleted ? "primary" : "secondary"}
      size="sm"
      onClick={handleToggleComplete}
      disabled={toggleCompleteMutation.isPending}
      isLoading={toggleCompleteMutation.isPending}
      icon={isCompleted ? CheckCircle2 : undefined}
      iconPosition="left"
      className={`min-h-[44px] touch-manipulation ${
        isCompleted
          ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          : ""
      }`}
    >
      <span className="hidden xs:inline">{isCompleted ? "Completed" : "Mark as Complete"}</span>
      <span className="xs:hidden">{isCompleted ? "Done" : "Complete"}</span>
    </Button>
  );
};

MarkAsCompleteButton.propTypes = {
  categoryId: PropTypes.string.isRequired,
  topicId: PropTypes.string.isRequired,
  onCompleteChange: PropTypes.func,
};

export default MarkAsCompleteButton;

