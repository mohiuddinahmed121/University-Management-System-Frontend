import {
   createSemester,
   getAllSemesters,
   getSingleSemester,
   updateSemester,
   updateSemesterStatus,
} from "@/api";
import type { IGetAllSemestersQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllSemesters(query?: IGetAllSemestersQuery) {
   return useQuery({
      queryKey: ["semesters", query],
      queryFn: () => getAllSemesters(query),
   });
}

export function useGetSingleSemester(semesterId: string) {
   return useQuery({
      queryKey: ["semester", semesterId],
      queryFn: () => getSingleSemester(semesterId),
      enabled: !!semesterId,
   });
}

export function useCreateSemester() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createSemester,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["semesters"] });
      },
   });
}

export function useUpdateSemester() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateSemester,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["semesters"] });
         queryClient.invalidateQueries({ queryKey: ["semester", variables.semesterId] });
      },
   });
}

export function useUpdateSemesterStatus() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateSemesterStatus,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["semesters"] });
         queryClient.invalidateQueries({ queryKey: ["semester", variables.semesterId] });
      },
   });
}
