import type { IMeta } from "./admin.type";

export type SemesterName = "SPRING" | "SUMMER" | "FALL";
export type SemesterStatus = "UPCOMING" | "ONGOING" | "COMPLETED";

export interface ISemesterSection {
   id: string;
   course: { id: string; code: string; title: string };
   instructor: { id: string; name: string; instructorId: string } | null;
}

export interface ISemester {
   id: string;
   name: SemesterName;
   year: number;
   startDate: string;
   endDate: string;
   feeAmount: number;
   status: SemesterStatus;
   _count?: { sections: number; payments: number };
   createdAt: string;
   updatedAt: string;
}

export interface ISemesterDetail extends ISemester {
   sections?: ISemesterSection[];
}

export interface ICreateSemesterPayload {
   name: SemesterName;
   year: number;
   startDate: string;
   endDate: string;
   feeAmount: number;
}

export type IUpdateSemesterPayload = Partial<
   Pick<ICreateSemesterPayload, "startDate" | "endDate" | "feeAmount" | "name" | "year">
>;

export interface IGetAllSemestersQuery {
   page?: number;
   limit?: number;
   searchTerm?: string;
   status?: SemesterStatus;
   year?: number;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
}

export interface IGetAllSemestersResponse {
   success: boolean;
   message: string;
   data: ISemester[];
   meta: IMeta;
}

export interface IGetSingleSemesterResponse {
   success: boolean;
   message: string;
   data: ISemesterDetail;
}
