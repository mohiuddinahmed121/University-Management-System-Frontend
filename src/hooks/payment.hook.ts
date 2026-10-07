import { createPayment, getAllPayments, getMyPayments, getSinglePayment } from "@/api";
import type { IGetPaymentsQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetMyPayments(query?: IGetPaymentsQuery) {
   return useQuery({
      queryKey: ["my-payments", query],
      queryFn: () => getMyPayments(query),
   });
}

export function useGetAllPayments(query?: IGetPaymentsQuery) {
   return useQuery({
      queryKey: ["all-payments", query],
      queryFn: () => getAllPayments(query),
   });
}

export function useGetSinglePayment(paymentId: string) {
   return useQuery({
      queryKey: ["payment", paymentId],
      queryFn: () => getSinglePayment(paymentId),
      enabled: !!paymentId,
   });
}

export function useCreatePayment() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createPayment,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["my-payments"] });
      },
   });
}
