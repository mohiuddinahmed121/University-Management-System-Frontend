import type { IMeta } from "./admin.type";
import type { IDepartmentLite } from "./course.type";

export interface IProgramStudent {
   id: string;
   studentId: string;
   name: string;
   email: string;
}

export interface IProgram {
   id: string;
   name: string;
   code: string;
   description?: string | null;
   durationYears: number;
   departmentId: string;
   department: IDepartmentLite;
   _count?: { students: number };
   createdAt: string;
   updatedAt: string;
}

export interface IProgramDetail extends IProgram {
   students?: IProgramStudent[];
}

export interface ICreateProgramPayload {
   name: string;
   code: string;
   description?: string;
   durationYears: number;
   departmentId: string;
}

export type IUpdateProgramPayload = Partial<ICreateProgramPayload>;

export interface IGetAllProgramsQuery {
   page?: number;
   limit?: number;
   searchTerm?: string;
   departmentId?: string;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
}

export interface IGetAllProgramsResponse {
   success: boolean;
   message: string;
   data: IProgram[];
   meta: IMeta;
}

export interface IGetSingleProgramResponse {
   success: boolean;
   message: string;
   data: IProgramDetail;
}
