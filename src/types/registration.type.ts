import type { IMeta } from "./admin.type";
import type { ICourseLite } from "./course.type";
import type { IInstructorLite, ISemesterLite } from "./section.type";

export type RegistrationStatus = "REGISTERED" | "DROPPED" | "COMPLETED";

export interface IRegistrationSection {
   id: string;
   sectionName: string;
   course: ICourseLite;
   semester: ISemesterLite;
   instructor?: IInstructorLite | null;
}

export interface IRegistrationStudent {
   id: string;
   studentId: string;
   name: string;
   email: string;
}

export interface IRegistrationResult {
   id: string;
   grade?: string | null;
   gpa?: number | null;
}

export interface IRegistration {
   id: string;
   status: RegistrationStatus;
   registeredAt: string;
   droppedAt?: string | null;
   studentId: string;
   sectionId: string;
   section: IRegistrationSection;
   student?: IRegistrationStudent;
   result?: IRegistrationResult | null;
}

export interface ICreateRegistrationPayload {
   sectionId: string;
}

export interface IGetRegistrationsQuery {
   page?: number;
   limit?: number;
   status?: RegistrationStatus;
   studentId?: string;
   sectionId?: string;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
}

export interface IGetRegistrationsResponse {
   success: boolean;
   message: string;
   data: IRegistration[];
   meta: IMeta;
}

export interface IGetSingleRegistrationResponse {
   success: boolean;
   message: string;
   data: IRegistration;
}
