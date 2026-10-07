export interface IDepartmentMini {
   id: string;
   name: string;
   code?: string;
}

export interface IProgramMini {
   id: string;
   name: string;
   department: IDepartmentMini;
}

export interface IUserMini {
   id: string;
   email: string;
   role: string;
   status?: string;
   createdAt?: string;
}

export interface IStudent {
   id: string;
   userId: string;
   studentId: string;
   name: string;
   email: string;
   contactNumber?: string | null;
   address?: string | null;
   dateOfBirth?: string | null;
   gender?: "MALE" | "FEMALE" | "OTHER" | null;
   programId: string;
   program: IProgramMini;
   user: IUserMini;
   createdAt: string;
   updatedAt: string;
}

export interface IUpdateStudentProfilePayload {
   address?: string;
   contactNumber?: string;
   dateOfBirth?: Date;
   gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface IGetAllStudentsQuery {
   searchTerm?: string;
   page?: number;
   limit?: number;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
}

export interface IStudentsMeta {
   page: number;
   limit: number;
   total: number;
   totalPages: number;
}

export interface IGetAllStudentsResponse {
   data: IStudent[];
   meta: IStudentsMeta;
}
