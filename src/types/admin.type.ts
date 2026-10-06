import { UserRole } from "./user.type";

export type UserAccountStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface IAdminUser {
   id: string;
   name: string;
   email: string;
   role: UserRole;
   status: UserAccountStatus;
   authProvider: "CREDENTIAL" | "GOOGLE";
   emailVerified: boolean;
   imageUrl: string | null;
   isDeleted: boolean;
   createdAt: string;
   updatedAt: string;
   student?: {
      id: string;
      studentId: string;
      program?: { id: string; name: string; code: string } | null;
   } | null;
   instructor?: {
      id: string;
      instructorId: string;
      department?: { id: string; name: string; code: string } | null;
   } | null;
}

export interface IGetAllUsersQuery {
   page?: number;
   limit?: number;
   searchTerm?: string;
   role?: UserRole;
   status?: UserAccountStatus;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
}

export interface IMeta {
   page: number;
   limit: number;
   total: number;
   totalPages: number;
}

export interface IGetAllUsersResponse {
   success: boolean;
   message: string;
   data: IAdminUser[];
   meta: IMeta;
}

export interface IGetSingleUserResponse {
   success: boolean;
   message: string;
   data: IAdminUser;
}

export interface IUpdateUserStatusPayload {
   status: UserAccountStatus;
}
