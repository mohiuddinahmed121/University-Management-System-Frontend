import apiClient from "@/lib/apiClient";
import type {
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

export const getMyProfile = () => {
   return apiClient<IStudent>("/student/my-profile");
};

export const updateStudentProfile = (payload: IUpdateStudentProfilePayload) => {
   return apiClient<IStudent>("/student/update-my-profile", {
      method: "PATCH",
      body: payload,
   });
};

export const getSingleStudentProfile = (studentId: string) => {
   return apiClient<IStudent>(`/student/public/${studentId}`);
};
