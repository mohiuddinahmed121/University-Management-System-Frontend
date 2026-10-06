import {
   createDepartment,
   deleteDepartment,
   getAllDepartments,
   getSingleDepartment,
   updateDepartment,
} from "@/api";
import type { IGetAllDepartmentsQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllDepartments(query?: IGetAllDepartmentsQuery) {
   return useQuery({
      queryKey: ["departments", query],
      queryFn: () => getAllDepartments(query),
   });
}

export function useGetSingleDepartment(departmentId: string) {
   return useQuery({
      queryKey: ["department", departmentId],
      queryFn: () => getSingleDepartment(departmentId),
      enabled: !!departmentId,
   });
}

export function useCreateDepartment() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createDepartment,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["departments"] });
      },
   });
}

export function useUpdateDepartment() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateDepartment,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["departments"] });
         queryClient.invalidateQueries({ queryKey: ["department", variables.departmentId] });
      },
   });
}

export function useDeleteDepartment() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteDepartment,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["departments"] });
      },
   });
}
