import apiClient from "@/lib/apiClient";
import { InstructorApplicationPayload, VerifyAccountPayload } from "@/types";
import type {
   IApiResponse,
   IInstructorPublicProfile,
   IUpdateInstructorProfilePayload,
   IGetAllInstructorsQuery,
   IGetAllInstructorsResponse,
   IApproveInstructorPayload,
   IApproveInstructorResult,
} from "@/types";

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

export const getInstructorPublicProfile = async (instructorId: string) => {
   const res = await apiClient<IApiResponse<IInstructorPublicProfile>>(
      `/instructor/public/${instructorId}`,
   );
   return res.data;
};

export const updateMyInstructorProfile = async (payload: IUpdateInstructorProfilePayload) => {
   const res = await apiClient<IApiResponse<IInstructorPublicProfile>>(
      "/instructor/update-my-profile",
      {
         method: "PATCH",
         body: payload,
      },
   );
   return res.data;
};

/* ---------- Admin: Instructor Applications ---------- */

export const getAllInstructors = async (query?: IGetAllInstructorsQuery) => {
   return apiClient<IGetAllInstructorsResponse>("/instructor/all-instructors", {
      method: "GET",
      query,
   });
};

export const approveInstructor = async (payload: IApproveInstructorPayload) => {
   const res = await apiClient<IApiResponse<IApproveInstructorResult>>(
      "/instructor/approve-instructor",
      {
         method: "POST",
         body: payload,
      },
   );
   return res.data;
};
