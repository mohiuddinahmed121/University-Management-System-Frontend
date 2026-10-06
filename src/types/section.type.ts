import type { IMeta } from "./admin.type";
import type { ICourseLite } from "./course.type";

export type SectionStatus = "OPEN" | "CLOSED" | "COMPLETED";

export interface ISemesterLite {
   id: string;
   name: string;
   year: number;
}

export interface IInstructorLite {
   id: string;
   name: string;
   instructorId: string;
}

export interface ISectionStudent {
   id: string;
   name: string;
   studentId: string;
}

export interface ISectionRegistration {
   id: string;
   student: ISectionStudent;
}

export interface ISection {
   id: string;
   sectionName: string;
   capacity: number;
   availableSeats: number;
   status: SectionStatus;
   courseId: string;
   semesterId: string;
   instructorId?: string | null;
   course: ICourseLite;
   semester: ISemesterLite;
   instructor?: IInstructorLite | null;
   _count?: { registrations: number };
   createdAt: string;
   updatedAt: string;
}

export interface ISectionDetail extends ISection {
   registrations?: ISectionRegistration[];
}

export interface ICreateSectionPayload {
   sectionName: string;
   capacity: number;
   courseId: string;
   semesterId: string;
   instructorId?: string;
}

export interface IUpdateSectionPayload {
   sectionName?: string;
   capacity?: number;
   instructorId?: string;
}

export interface IGetAllSectionsQuery {
   page?: number;
   limit?: number;
   searchTerm?: string;
   courseId?: string;
   semesterId?: string;
   instructorId?: string;
   status?: SectionStatus;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
}

export interface IGetAllSectionsResponse {
   success: boolean;
   message: string;
   data: ISection[];
   meta: IMeta;
}

export interface IGetSingleSectionResponse {
   success: boolean;
   message: string;
   data: ISectionDetail;
}
