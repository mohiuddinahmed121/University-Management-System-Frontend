import apiClient from "@/lib/apiClient";
import type {
   IApiResponse,
   ICreatePaymentPayload,
   ICreatePaymentResponse,
   IGetPaymentsQuery,
   IGetPaymentsResponse,
   IPayment,
} from "@/types";

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

export const createPayment = async (payload: ICreatePaymentPayload) => {
   const res = await apiClient<IApiResponse<ICreatePaymentResponse>>("/payment/create-payment", {
      method: "POST",
      body: payload,
   });
   return res.data;
};

export const getSinglePayment = async (paymentId: string) => {
   const res = await apiClient<IApiResponse<IPayment>>(`/payment/${paymentId}`);
   return res.data;
};
