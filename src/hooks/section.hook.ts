import {
   closeSection,
   createSection,
   deleteSection,
   getAllSections,
   getSectionById,
   updateSection,
} from "@/api";
import type { IGetAllSectionsQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllSections(query?: IGetAllSectionsQuery) {
   return useQuery({
      queryKey: ["sections", query],
      queryFn: () => getAllSections(query),
   });
}

export function useGetSingleSection(sectionId: string) {
   return useQuery({
      queryKey: ["section", sectionId],
      queryFn: () => getSectionById(sectionId),
      enabled: !!sectionId,
   });
}

export function useCreateSection() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createSection,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["sections"] });
      },
   });
}

export function useUpdateSection() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateSection,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["sections"] });
         queryClient.invalidateQueries({ queryKey: ["section", variables.sectionId] });
      },
   });
}

export function useCloseSection() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: closeSection,
      onSuccess: (_, sectionId) => {
         queryClient.invalidateQueries({ queryKey: ["sections"] });
         queryClient.invalidateQueries({ queryKey: ["section", sectionId] });
      },
   });
}

export function useDeleteSection() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteSection,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["sections"] });
      },
   });
}
