import apiClient from "@/lib/apiClient";
import type {
   ICreateDepartmentPayload,
   IGetAllDepartmentsQuery,
   IGetAllDepartmentsResponse,
   IGetSingleDepartmentResponse,
   IUpdateDepartmentPayload,
} from "@/types";

export function createDepartment(payload: ICreateDepartmentPayload) {
   return apiClient<IGetSingleDepartmentResponse>("/department/create-department", {
      method: "POST",
      body: payload,
   });
}

export function getAllDepartments(query?: IGetAllDepartmentsQuery) {
   return apiClient<IGetAllDepartmentsResponse>("/department/all-departments", { params: query });
}

export function getSingleDepartment(departmentId: string) {
   return apiClient<IGetSingleDepartmentResponse>(`/department/${departmentId}`);
}

export function updateDepartment({
   departmentId,
   payload,
}: {
   departmentId: string;
   payload: IUpdateDepartmentPayload;
}) {
   return apiClient<IGetSingleDepartmentResponse>(`/department/update-department/${departmentId}`, {
      method: "PATCH",
      body: payload,
   });
}

export function deleteDepartment(departmentId: string) {
   return apiClient(`/department/${departmentId}`, { method: "DELETE" });
}
