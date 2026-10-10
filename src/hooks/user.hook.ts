import { uploadProfileImage } from "@/api/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadProfileImage() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: uploadProfileImage,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["user"] });
      },
   });
}
