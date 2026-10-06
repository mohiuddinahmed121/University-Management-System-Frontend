import apiClient from "@/lib/apiClient";
import type {
   ICreateSectionPayload,
   IGetAllSectionsQuery,
   IGetAllSectionsResponse,
   IGetSingleSectionResponse,
   IUpdateSectionPayload,
} from "@/types";

export function createSection(payload: ICreateSectionPayload) {
   return apiClient<IGetSingleSectionResponse>("/section/create-section", {
      method: "POST",
      body: payload,
   });
}

export function getAllSections(query?: IGetAllSectionsQuery) {
   return apiClient<IGetAllSectionsResponse>("/section/all-sections", { params: query });
}

export function getSectionById(sectionId: string) {
   return apiClient<IGetSingleSectionResponse>(`/section/${sectionId}`);
}

export function updateSection({
   sectionId,
   payload,
}: {
   sectionId: string;
   payload: IUpdateSectionPayload;
}) {
   return apiClient<IGetSingleSectionResponse>(`/section/update-section/${sectionId}`, {
      method: "PATCH",
      body: payload,
   });
}

export function closeSection(sectionId: string) {
   return apiClient<IGetSingleSectionResponse>(`/section/close-section/${sectionId}`, {
      method: "PATCH",
   });
}

export function deleteSection(sectionId: string) {
   return apiClient(`/section/${sectionId}`, { method: "DELETE" });
}
