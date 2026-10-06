import apiClient from "@/lib/apiClient";
import type {
   ICreateCoursePayload,
   ICreateCoursePrerequisitePayload,
   IGetAllCoursesQuery,
   IGetAllCoursesResponse,
   IGetSingleCourseResponse,
   IUpdateCoursePayload,
} from "@/types";

export function createCourse(payload: ICreateCoursePayload) {
   return apiClient<IGetSingleCourseResponse>("/course/create-course", {
      method: "POST",
      body: payload,
   });
}

export function getAllCourses(query?: IGetAllCoursesQuery) {
   return apiClient<IGetAllCoursesResponse>("/course/all-courses", { params: query });
}

export function getSingleCourse(courseId: string) {
   return apiClient<IGetSingleCourseResponse>(`/course/${courseId}`);
}

export function updateCourse({
   courseId,
   payload,
}: {
   courseId: string;
   payload: IUpdateCoursePayload;
}) {
   return apiClient<IGetSingleCourseResponse>(`/course/update-course/${courseId}`, {
      method: "PATCH",
      body: payload,
   });
}

export function deleteCourse(courseId: string) {
   return apiClient(`/course/${courseId}`, { method: "DELETE" });
}

export function addPrerequisite({
   courseId,
   payload,
}: {
   courseId: string;
   payload: ICreateCoursePrerequisitePayload;
}) {
   return apiClient(`/course/${courseId}/prerequisite`, {
      method: "POST",
      body: payload,
   });
}

export function removePrerequisite({
   courseId,
   prerequisiteCourseId,
}: {
   courseId: string;
   prerequisiteCourseId: string;
}) {
   return apiClient(`/course/${courseId}/prerequisite/${prerequisiteCourseId}`, {
      method: "DELETE",
   });
}
