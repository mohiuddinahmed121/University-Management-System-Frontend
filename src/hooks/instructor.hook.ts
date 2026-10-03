import { applyAsInstructor, verifyInstructorEmail } from "@/api/instructor.api";
import { useMutation } from "@tanstack/react-query";

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
