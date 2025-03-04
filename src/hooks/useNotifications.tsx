import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "$/supabase/client";
import { Notification } from "$/types/data.types";

export const useNotifications = (userId: string | null) => {
  const queryClient = useQueryClient();

  const query = useQuery<Notification[], Error>({
    queryKey: ["notifications", userId],
    queryFn: async (): Promise<Notification[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .neq("sender_id", userId)
        .eq("is_read", false) // Only unread notifications
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:user:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["notifications", userId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return query;
};

export const useUnreadNotificationsCount = (userId: string | null) => {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  // Query for unread notifications count
  const { data } = useQuery<number, Error>({
    queryKey: ["unread-notifications", userId],
    queryFn: async (): Promise<number> => {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact" })
        .eq("user_id", userId) // Only notifications for this user
        .neq("sender_id", userId) // Ignore self-notifications
        .eq("is_read", false); // Only unread notifications

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!userId, // Ensures query only runs when userId is available
  });

  // Update unread count when query data changes
  useEffect(() => {
    if (data !== undefined) {
      setUnreadCount(data);
    }
  }, [data]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`realtime-unread-notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT", // New notification added
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["unread-notifications", userId],
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE", // Notification marked as read
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId} AND is_read=eq.true`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["unread-notifications", userId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return unreadCount;
};

export const useCountShareNotifications = (
  userId: string | null,
  post_id: number | null
) => {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications count
  const { data } = useQuery<number, Error>({
    queryKey: ["share-notifications", userId, post_id],
    queryFn: async (): Promise<number> => {
      if (!post_id || !userId) return 0;

      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact" })
        .eq("post_id", post_id)
        .neq("sender_id", userId) // Ignore self-notifications
        .eq("type", "share");

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!userId && !!post_id, // Ensures query only runs when userId and post_id are available
  });

  // Update unread count when data changes
  useEffect(() => {
    if (data !== undefined) {
      setUnreadCount(data);
    }
  }, [data]);

  // Real-time subscription to listen for new notifications (only INSERT)
  useEffect(() => {
    if (!post_id) return;

    const channel = supabase
      .channel(`realtime-notifications-${post_id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          if (
            payload.new?.post_id === post_id &&
            payload.new?.type === "share"
          ) {
            queryClient.invalidateQueries({
              queryKey: ["share-notifications", userId, post_id],
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe(); // Proper cleanup
    };
  }, [queryClient, post_id, userId]);

  return unreadCount;
};
