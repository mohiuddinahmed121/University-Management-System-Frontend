import apiClient from "@/lib/apiClient";
import type {
   IGetAllResultsQuery,
   IGetAllResultsResponse,
   IGetMyResultsResponse,
   IResult,
   ISubmitResultPayload,
   IUpdateResultPayload,
} from "@/types";

export const submitResult = (payload: ISubmitResultPayload) => {
   return apiClient<IResult>("/result/submit", {
      method: "POST",
      body: payload,
   });
};

export const updateResult = ({
   resultId,
   payload,
}: {
   resultId: string;
   payload: IUpdateResultPayload;
}) => {
   return apiClient<IResult>(`/result/update/${resultId}`, {
      method: "PATCH",
      body: payload,
   });
};

export const getMyResults = () => {
   return apiClient<IGetMyResultsResponse>("/result/my-results");
};

export const getAllResults = (query?: IGetAllResultsQuery) => {
   return apiClient<IGetAllResultsResponse>("/result/all-results", {
      query,
   });
};

export const getSingleResult = (resultId: string) => {
   return apiClient<IResult>(`/result/${resultId}`);
};
