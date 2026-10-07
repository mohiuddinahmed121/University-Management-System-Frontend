import apiClient from "@/lib/apiClient";
import type {
   ICreatePaymentPayload,
   ICreatePaymentResponse,
   IGetPaymentsQuery,
   IGetPaymentsResponse,
   IPayment,
} from "@/types";

export const createPayment = (payload: ICreatePaymentPayload) => {
   return apiClient<ICreatePaymentResponse>("/payment/create-payment", {
      method: "POST",
      body: payload,
   });
};

export const getMyPayments = (query?: IGetPaymentsQuery) => {
   return apiClient<IGetPaymentsResponse>("/payment/my-payments", {
      query,
   });
};

export const getAllPayments = (query?: IGetPaymentsQuery) => {
   return apiClient<IGetPaymentsResponse>("/payment/all-payments", {
      query,
   });
};

export const getSinglePayment = (paymentId: string) => {
   return apiClient<IPayment>(`/payment/${paymentId}`);
};
