import type { IMeta } from "./admin.type";

export interface IDepartmentCounts {
   programs: number;
   courses: number;
   instructors: number;
}

export interface IDepartment {
   id: string;
   name: string;
   code: string;
   description?: string | null;
   isDeleted: boolean;
   createdAt: string;
   updatedAt: string;
   _count?: IDepartmentCounts;
}

export interface IDepartmentDetail extends IDepartment {
   programs?: { id: string; name: string; code: string }[];
   courses?: { id: string; code: string; title: string }[];
   instructors?: { id: string; name: string; instructorId: string }[];
}

export interface ICreateDepartmentPayload {
   name: string;
   code: string;
   description?: string;
}

export type IUpdateDepartmentPayload = Partial<ICreateDepartmentPayload>;

export interface IGetAllDepartmentsQuery {
   page?: number;
   limit?: number;
   searchTerm?: string;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
}

export interface IGetAllDepartmentsResponse {
   success: boolean;
   message: string;
   data: IDepartment[];
   meta: IMeta;
}

export interface IGetSingleDepartmentResponse {
   success: boolean;
   message: string;
   data: IDepartmentDetail;
}
