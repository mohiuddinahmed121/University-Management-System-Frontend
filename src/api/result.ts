import apiClient from "@/lib/apiClient";
import type {
   IGetAllResultsQuery,
   IGetAllResultsResponse,
   IGetMyResultsResponse,
   IGetSingleResultResponse,
   ISubmitResultPayload,
   IUpdateResultPayload,
} from "@/types";

export const submitResult = async (payload: ISubmitResultPayload) => {
   const res = await apiClient<IGetSingleResultResponse>("/result/submit", {
      method: "POST",
      body: payload,
   });
   return res.data;
};

export const updateResult = async ({
   resultId,
   payload,
}: {
   resultId: string;
   payload: IUpdateResultPayload;
}) => {
   const res = await apiClient<IGetSingleResultResponse>(`/result/update/${resultId}`, {
      method: "PATCH",
      body: payload,
   });
   return res.data;
};

export const getMyResults = () => {
   return apiClient<IGetMyResultsResponse>("/result/my-results");
};

export const getAllResults = (query?: IGetAllResultsQuery) => {
   return apiClient<IGetAllResultsResponse>("/result/all-results", {
      query,
   });
};

export const getSingleResult = async (resultId: string) => {
   const res = await apiClient<IGetSingleResultResponse>(`/result/${resultId}`);
   return res.data;
};
