import apiClient from "@/lib/apiClient";
import type {
   ICreateSemesterPayload,
   IGetAllSemestersQuery,
   IGetAllSemestersResponse,
   IGetSingleSemesterResponse,
   IUpdateSemesterPayload,
   SemesterStatus,
} from "@/types";

export function createSemester(payload: ICreateSemesterPayload) {
   return apiClient<IGetSingleSemesterResponse>("/semester/create-semester", {
      method: "POST",
      body: payload,
   });
}

export function getAllSemesters(query?: IGetAllSemestersQuery) {
   return apiClient<IGetAllSemestersResponse>("/semester/all-semesters", { params: query });
}

export function getSingleSemester(semesterId: string) {
   return apiClient<IGetSingleSemesterResponse>(`/semester/${semesterId}`);
}

export function updateSemester({
   semesterId,
   payload,
}: {
   semesterId: string;
   payload: IUpdateSemesterPayload;
}) {
   return apiClient<IGetSingleSemesterResponse>(`/semester/update-semester/${semesterId}`, {
      method: "PATCH",
      body: payload,
   });
}

export function updateSemesterStatus({
   semesterId,
   status,
}: {
   semesterId: string;
   status: SemesterStatus;
}) {
   return apiClient<IGetSingleSemesterResponse>(`/semester/update-status/${semesterId}`, {
      method: "PATCH",
      body: { status },
   });
}
