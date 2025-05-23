import { supabase } from "$/supabase/client";
import { addNotification } from "./addNotification";
import { log, logError } from "@/utils/sentryUtils";

export async function likePost(
  postId: number,
  userId: string,
  postAuthor: string
) {
  try {
    // Check if a like already exists
    const { data: existingLike, error: fetchError } = await supabase
      .from("likes")
      .select("*")
      .eq("author", userId)
      .eq("post_id", postId)
      .single(); // Fetch only one record

    if (fetchError && fetchError.code !== "PGRST116") {
      // Ignore 'not found' errors (code PGRST116 indicates no rows found)
      logError("Error fetching like", fetchError);
      return false;
    }

    if (existingLike) {
      // Like exists, delete it
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id); // Delete by primary key

      if (deleteError) {
        logError("Error deleting like", deleteError);
        return false;
      }
    } else {
      // Like does not exist, add it
      const { error: insertError } = await supabase.from("likes").insert([
        {
          author: userId,
          post_id: postId,
          post_author: postAuthor,
        },
      ]);

      if (insertError) {
        logError("Error adding like", insertError);
        return false;
      }

      //add notifications
      await addNotification({
        userId: postAuthor,
        senderId: userId,
        postId,
        type: "like",
      });
    }

    return true;
  } catch (err) {
    logError("An unexpected error occurred", err);
    return false;
  }
}
