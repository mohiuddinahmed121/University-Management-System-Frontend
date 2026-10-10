import apiClient from "@/lib/apiClient";
import type { IUploadProfileImageResponse } from "@/types";

export const uploadProfileImage = async (file: File) => {
   const formData = new FormData();
   formData.append("profileImage", file);

   const res = await apiClient<IUploadProfileImageResponse>("/user/profile-image", {
      method: "PATCH",
      body: formData,
   });
   return res.data;
};
