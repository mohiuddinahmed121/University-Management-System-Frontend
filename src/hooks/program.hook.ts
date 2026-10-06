import {
   createProgram,
   deleteProgram,
   getAllPrograms,
   getSingleProgram,
   updateProgram,
} from "@/api";
import type { IGetAllProgramsQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllPrograms(query?: IGetAllProgramsQuery) {
   return useQuery({
      queryKey: ["programs", query],
      queryFn: () => getAllPrograms(query),
   });
}

export function useGetSingleProgram(programId: string) {
   return useQuery({
      queryKey: ["program", programId],
      queryFn: () => getSingleProgram(programId),
      enabled: !!programId,
   });
}

export function useCreateProgram() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createProgram,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["programs"] });
      },
   });
}

export function useUpdateProgram() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateProgram,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["programs"] });
         queryClient.invalidateQueries({ queryKey: ["program", variables.programId] });
      },
   });
}

export function useDeleteProgram() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteProgram,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["programs"] });
      },
   });
}
