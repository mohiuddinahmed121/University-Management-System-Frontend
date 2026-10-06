import apiClient from "@/lib/apiClient";
import type {
   ICreateRegistrationPayload,
   IGetRegistrationsQuery,
   IGetRegistrationsResponse,
   IGetSingleRegistrationResponse,
} from "@/types";

export function createRegistration(payload: ICreateRegistrationPayload) {
   return apiClient<IGetSingleRegistrationResponse>("/registration/register", {
      method: "POST",
      body: payload,
   });
}

export function dropRegistration(registrationId: string) {
   return apiClient<IGetSingleRegistrationResponse>(`/registration/drop/${registrationId}`, {
      method: "PATCH",
   });
}

export function getMyRegistrations(query?: IGetRegistrationsQuery) {
   return apiClient<IGetRegistrationsResponse>("/registration/my-registrations", { params: query });
}

export function getAllRegistrations(query?: IGetRegistrationsQuery) {
   return apiClient<IGetRegistrationsResponse>("/registration/all-registrations", {
      params: query,
   });
}

export function getSingleRegistration(registrationId: string) {
   return apiClient<IGetSingleRegistrationResponse>(`/registration/${registrationId}`);
}
