import {
   addPrerequisite,
   createCourse,
   deleteCourse,
   getAllCourses,
   getSingleCourse,
   removePrerequisite,
   updateCourse,
} from "@/api";
import type { IGetAllCoursesQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllCourses(query?: IGetAllCoursesQuery) {
   return useQuery({
      queryKey: ["courses", query],
      queryFn: () => getAllCourses(query),
   });
}

export function useGetSingleCourse(courseId: string) {
   return useQuery({
      queryKey: ["course", courseId],
      queryFn: () => getSingleCourse(courseId),
      enabled: !!courseId,
   });
}

export function useCreateCourse() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createCourse,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["courses"] });
      },
   });
}

export function useUpdateCourse() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateCourse,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["courses"] });
         queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
      },
   });
}

export function useDeleteCourse() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteCourse,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["courses"] });
      },
   });
}

export function useAddPrerequisite() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addPrerequisite,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
      },
   });
}

export function useRemovePrerequisite() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: removePrerequisite,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
      },
   });
}
