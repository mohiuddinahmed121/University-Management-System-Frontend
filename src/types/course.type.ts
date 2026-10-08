import type { IMeta } from "./admin.type";

export interface IDepartmentLite {
   id: string;
   name: string;
   code: string;
}

export interface ICourseLite {
   id: string;
   code: string;
   title: string;
   credit: number;
}

export interface ICoursePrerequisite {
   id: string;
   courseId: string;
   prerequisiteCourseId: string;
   prerequisiteCourse: ICourseLite;
}

export interface ICourse {
   id: string;
   code: string;
   title: string;
   description?: string | null;
   credit: number;
   departmentId: string;
   department: IDepartmentLite;
   prerequisites?: ICoursePrerequisite[];
   prerequisiteFor?: { id: string; course: ICourseLite }[];
   isDeleted: boolean;
   sections?: ICourseSection[];
   createdAt: string;
   updatedAt: string;
}

export interface ICreateCoursePayload {
   code: string;
   title: string;
   description?: string;
   credit: number;
   departmentId: string;
}

export type IUpdateCoursePayload = Partial<ICreateCoursePayload>;

export interface IGetAllCoursesQuery {
   page?: number;
   limit?: number;
   searchTerm?: string;
   departmentId?: string;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
}

export interface IGetAllCoursesResponse {
   success: boolean;
   message: string;
   data: ICourse[];
   meta: IMeta;
}

export interface IGetSingleCourseResponse {
   success: boolean;
   message: string;
   data: ICourse;
}

export interface ICreateCoursePrerequisitePayload {
   prerequisiteCourseId: string;
}

export interface ISectionInstructorLite {
   id: string;
   name?: string;
}

export interface ISectionSemesterLite {
   id: string;
   name: string;
   year: number;
}

export interface ICourseSection {
   id: string;
   sectionName: string;
   capacity: number;
   availableSeats: number;
   status: "OPEN" | "CLOSED" | "COMPLETED";
   semester: ISectionSemesterLite;
   instructor?: ISectionInstructorLite | null;
}
