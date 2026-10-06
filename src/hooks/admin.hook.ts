import { getAllUsers, getSingleUser, updateUserStatus } from "@/api";
import type { IGetAllUsersQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllUsers(query?: IGetAllUsersQuery) {
   return useQuery({
      queryKey: ["admin-users", query],
      queryFn: () => getAllUsers(query),
   });
}

export function useGetSingleUser(userId: string) {
   return useQuery({
      queryKey: ["admin-user", userId],
      queryFn: () => getSingleUser(userId),
      enabled: !!userId,
   });
}

export function useUpdateUserStatus() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateUserStatus,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["admin-users"] });
         queryClient.invalidateQueries({ queryKey: ["admin-user"] });
      },
   });
}
