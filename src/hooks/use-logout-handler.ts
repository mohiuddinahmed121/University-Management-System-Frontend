"use client";

import { toast } from "@/components/ui/toast";
import { useLogout } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogoutHandler() {
   const router = useRouter();
   const { mutate: logout, isPending } = useLogout();
   const queryClient = useQueryClient();

   const handleLogout = () => {
      logout(undefined, {
         onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["user"] });
            toast.add({
               title: "Logged out",
               description: "Logged out successfully",
               type: "success",
            });
            router.replace("/");
            router.refresh();
         },
         onError: () => {
            toast.add({
               title: "Logout failed",
               description: "Something went wrong",
               type: "error",
            });
         },
      });
   };

   return { handleLogout, isPending };
}
