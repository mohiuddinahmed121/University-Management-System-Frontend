import {
   createRegistration,
   dropRegistration,
   getAllRegistrations,
   getMyRegistrations,
   getSingleRegistration,
} from "@/api";
import type { IGetRegistrationsQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetMyRegistrations(query?: IGetRegistrationsQuery) {
   return useQuery({
      queryKey: ["my-registrations", query],
      queryFn: () => getMyRegistrations(query),
   });
}

export function useGetAllRegistrations(query?: IGetRegistrationsQuery) {
   return useQuery({
      queryKey: ["all-registrations", query],
      queryFn: () => getAllRegistrations(query),
   });
}

export function useGetSingleRegistration(registrationId: string) {
   return useQuery({
      queryKey: ["registration", registrationId],
      queryFn: () => getSingleRegistration(registrationId),
      enabled: !!registrationId,
   });
}

export function useCreateRegistration() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createRegistration,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
         queryClient.invalidateQueries({ queryKey: ["sections"] });
      },
   });
}

export function useDropRegistration() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: dropRegistration,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
         queryClient.invalidateQueries({ queryKey: ["sections"] });
      },
   });
}
