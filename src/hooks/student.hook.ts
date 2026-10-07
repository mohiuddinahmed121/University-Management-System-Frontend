import { getAllStudents, getMyProfile, getSingleStudentProfile, updateStudentProfile } from "@/api";
import type { IGetAllStudentsQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllStudents(query?: IGetAllStudentsQuery) {
   return useQuery({
      queryKey: ["all-students", query],
      queryFn: () => getAllStudents(query),
   });
}

export function useGetMyProfile() {
   return useQuery({
      queryKey: ["my-profile"],
      queryFn: () => getMyProfile(),
   });
}

export function useGetSingleStudentProfile(studentId: string) {
   return useQuery({
      queryKey: ["student", studentId],
      queryFn: () => getSingleStudentProfile(studentId),
      enabled: !!studentId,
   });
}

export function useUpdateStudentProfile() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateStudentProfile,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      },
   });
}
