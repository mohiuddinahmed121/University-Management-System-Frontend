import {
   applyAsInstructor,
   verifyInstructorEmail,
   getAllInstructors,
   approveInstructor,
} from "@/api/instructor.api";
import { getInstructorPublicProfile, getMe, updateMyInstructorProfile } from "@/api";
import type { IInstructorUser, IGetAllInstructorsQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useApplyAsInstructor() {
   return useMutation({
      mutationFn: applyAsInstructor,
   });
}

export function useVerifyInstructorEmail() {
   return useMutation({
      mutationFn: verifyInstructorEmail,
   });
}

export function useMyInstructor() {
   return useQuery({
      queryKey: ["user"],
      queryFn: getMe,
      select: (res) => res.data as unknown as IInstructorUser,
   });
}

export function useInstructorPublicProfile(instructorId: string) {
   return useQuery({
      queryKey: ["instructor-public", instructorId],
      queryFn: () => getInstructorPublicProfile(instructorId),
      enabled: !!instructorId,
   });
}

export function useUpdateMyInstructorProfile() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateMyInstructorProfile,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["user"] });
         queryClient.invalidateQueries({ queryKey: ["instructor-public"] });
      },
   });
}

export function useGetAllInstructors(query?: IGetAllInstructorsQuery) {
   return useQuery({
      queryKey: ["admin-instructors", query],
      queryFn: () => getAllInstructors(query),
   });
}

export function useApproveInstructor() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: approveInstructor,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["admin-instructors"] });
      },
   });
}
