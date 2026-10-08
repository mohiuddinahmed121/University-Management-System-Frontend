import apiClient from "@/lib/apiClient";
import type {
   IApiResponse,
   IGetAllStudentsQuery,
   IGetAllStudentsResponse,
   IStudent,
   IUpdateStudentProfilePayload,
} from "@/types";

export const getAllStudents = (query?: IGetAllStudentsQuery) => {
   return apiClient<IGetAllStudentsResponse>("/student/all-students", {
      query,
   });
};

export const getMyProfile = async () => {
   const res = await apiClient<IApiResponse<IStudent>>("/student/my-profile");
   return res.data;
};

export const updateStudentProfile = async (payload: IUpdateStudentProfilePayload) => {
   const res = await apiClient<IApiResponse<IStudent>>("/student/update-my-profile", {
      method: "PATCH",
      body: payload,
   });
   return res.data;
};

export const getSingleStudentProfile = async (studentId: string) => {
   const res = await apiClient<IApiResponse<IStudent>>(`/student/public/${studentId}`);
   return res.data;
};
