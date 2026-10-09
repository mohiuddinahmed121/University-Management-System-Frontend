export interface IStudentMini {
   id: string;
   studentId: string;
   name: string;
   email?: string;
}

export interface ICourseMini {
   id: string;
   code: string;
   title: string;
   credit?: number;
}

export interface ISemesterMini {
   id: string;
   name: string;
   year?: number;
}

export interface IInstructorMini {
   id: string;
   name?: string;
}

export interface ISectionMini {
   id: string;
   name?: string;
   course: ICourseMini;
   semester: ISemesterMini;
   instructor?: IInstructorMini | null;
}

export interface IRegistrationMini {
   id: string;
   status: string;
   student: IStudentMini;
   section: ISectionMini;
}

export interface IResult {
   id: string;
   registrationId: string;
   grade: string;
   marks: number | string;
   gradePoint: number | string | null;
   submittedAt: string;
   createdAt: string;
   updatedAt: string;
   registration: IRegistrationMini;
}

export interface ISubmitResultPayload {
   registrationId: string;
   marks: number;
}

export interface IUpdateResultPayload {
   marks: number;
}

export interface IGetAllResultsQuery {
   page?: number;
   limit?: number;
   searchTerm?: string;
}

export interface IResultsMeta {
   page: number;
   limit: number;
   total: number;
   totalPages: number;
}

export interface IGetAllResultsResponse {
   data: IResult[];
   meta: IResultsMeta;
}

export interface IGetMyResultsResponse {
   success: boolean;
   message: string;
   data: IResult[];
}

export interface IGetSingleResultResponse {
   success: boolean;
   message: string;
   data: IResult;
}
