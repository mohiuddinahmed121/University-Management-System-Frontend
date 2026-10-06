import apiClient from "@/lib/apiClient";
import type {
   IGetAllUsersQuery,
   IGetAllUsersResponse,
   IGetSingleUserResponse,
   IUpdateUserStatusPayload,
} from "@/types";

export function getAllUsers(query?: IGetAllUsersQuery) {
   return apiClient<IGetAllUsersResponse>("/admin/users", { params: query });
}

export function getSingleUser(userId: string) {
   return apiClient<IGetSingleUserResponse>(`/admin/users/${userId}`);
}

export function updateUserStatus({
   userId,
   payload,
}: {
   userId: string;
   payload: IUpdateUserStatusPayload;
}) {
   return apiClient<IGetSingleUserResponse>(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: payload,
   });
}
