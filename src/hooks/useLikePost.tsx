import { supabase } from "$/supabase/client";
import { Like } from "$/types/data.types";
import { likePost } from "@/queries/post/likePost";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLikePost = (
  postId: number,
  userId: string | null,
  postAuthor: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // If userId is not provided, fetch it
      if (!userId) {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user?.id) {
          throw new Error("User ID is required to like a post.");
        }
        userId = data.user.id; // Assign fetched userId
      }

      return await likePost(postId, userId, postAuthor);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["postLikes", postId] });

      const previousLikes = queryClient.getQueryData<Like[]>([
        "postLikes",
        postId,
      ]);

      // Optimistically update UI
      queryClient.setQueryData(
        ["postLikes", postId],
        (oldLikes: Like[] = []) => {
          const alreadyLiked = oldLikes.some((like) => like.author === userId);

          return alreadyLiked
            ? oldLikes.filter((like) => like.author !== userId) // Remove like
            : [
                ...oldLikes,
                { id: Date.now().toString(), author: userId, post_id: postId },
              ]; // Fake ID for UI update
        },
      );

      return { previousLikes };
    },

    onError: (err, _, context) => {
      console.error("Error toggling like:", err);
      if (context?.previousLikes) {
        queryClient.setQueryData(["postLikes", postId], context.previousLikes);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["postLikes", postId] });
    },
  });
};
