import apiClient from "@/lib/apiClient";
import { InstructorApplicationPayload, VerifyAccountPayload } from "@/types";

export function applyAsInstructor(payload: InstructorApplicationPayload) {
   const formData = new FormData();

   formData.append("data", JSON.stringify(payload.data));
   formData.append("resume", payload.resume);

   return apiClient("/instructor/apply-as-instructor", {
      method: "POST",
      body: formData,
   });
}

export function verifyInstructorEmail(payload: VerifyAccountPayload) {
   return apiClient("/instructor/apply-as-instructor/verify-email", {
      method: "POST",
      body: payload,
   });
}
