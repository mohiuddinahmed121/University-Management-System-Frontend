import { getAllResults, getMyResults, getSingleResult, submitResult, updateResult } from "@/api";
import type { IGetAllResultsQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllResults(query?: IGetAllResultsQuery) {
   return useQuery({
      queryKey: ["all-results", query],
      queryFn: () => getAllResults(query),
   });
}

export function useGetMyResults() {
   return useQuery({
      queryKey: ["my-results"],
      queryFn: () => getMyResults(),
   });
}

export function useGetSingleResult(resultId: string) {
   return useQuery({
      queryKey: ["result", resultId],
      queryFn: () => getSingleResult(resultId),
      enabled: !!resultId,
   });
}

export function useSubmitResult() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: submitResult,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["all-results"] });
         queryClient.invalidateQueries({ queryKey: ["all-registrations"] });
      },
   });
}

export function useUpdateResult() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateResult,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["all-results"] });
         queryClient.invalidateQueries({ queryKey: ["result"] });
      },
   });
}
