import apiClient from "@/lib/apiClient";
import type {
   ICreateProgramPayload,
   IGetAllProgramsQuery,
   IGetAllProgramsResponse,
   IGetSingleProgramResponse,
   IUpdateProgramPayload,
} from "@/types";

export function createProgram(payload: ICreateProgramPayload) {
   return apiClient<IGetSingleProgramResponse>("/program/create-program", {
      method: "POST",
      body: payload,
   });
}

export function getAllPrograms(query?: IGetAllProgramsQuery) {
   return apiClient<IGetAllProgramsResponse>("/program/all-programs", { params: query });
}

export function getSingleProgram(programId: string) {
   return apiClient<IGetSingleProgramResponse>(`/program/${programId}`);
}

export function updateProgram({
   programId,
   payload,
}: {
   programId: string;
   payload: IUpdateProgramPayload;
}) {
   return apiClient<IGetSingleProgramResponse>(`/program/update-program/${programId}`, {
      method: "PATCH",
      body: payload,
   });
}

export function deleteProgram(programId: string) {
   return apiClient(`/program/${programId}`, { method: "DELETE" });
}
