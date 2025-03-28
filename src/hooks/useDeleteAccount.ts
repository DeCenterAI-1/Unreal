"use client";

import { useState } from "react";
import { supabase } from "$/supabase/client";
import { axiosInstanceLocal } from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { log, logError } from "@/utils/sentryUtils";

interface DeleteAccountResponse {
  success: boolean;
  error?: string;
}

const useDeleteAccount = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Use Next.js router

  const deleteAccount = async (): Promise<DeleteAccountResponse> => {
    setLoading(true);
    setError(null);

    log("Account deletion process initiated");

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        const errorMsg = "You need to be logged in.";
        logError(errorMsg, userError || new Error(errorMsg));
        throw new Error(errorMsg);
      }

      const { data: sessionData } = await supabase.auth.getSession();

      log("Sending account deletion request", { userId: userData.user.id });

      // Send request to delete account
      const response = await axiosInstanceLocal.delete("/api/account/delete", {
        headers: { "Content-Type": "application/json" },
        data: {
          userId: userData.user.id,
          token: sessionData.session?.access_token,
        },
      });

      if (response.status === 200) {
        log("Account deleted successfully, logging out user");
        // Log the user out from Supabase
        await supabase.auth.signOut();

        // Redirect to home page
        router.push("/");
      }

      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "An unexpected error occurred";

      logError("Account deletion failed", err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { deleteAccount, loading, error };
};

export default useDeleteAccount;
