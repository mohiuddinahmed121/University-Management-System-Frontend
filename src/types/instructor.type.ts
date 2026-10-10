export interface InstructorApplicationData {
   user: {
      name: string;
      email: string;
   };
   instructor: {
      address?: string;
      specialization?: string;
      designation?: string;
      contactNumber?: string;
      departmentId: string;
   };
}

export interface InstructorApplicationPayload {
   resume: File;
   data: InstructorApplicationData;
}

export interface IInstructorProfile {
   id: string;
   instructorId: string;
   name: string;
   email: string;
   address?: string | null;
   specialization?: string | null;
   designation?: string | null;
   contactNumber?: string | null;
   resumeUrl?: string | null;
   departmentId: string;
   verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
}

export interface IInstructorUser {
   id: string;
   name: string;
   email: string;
   role: string;
   imageUrl?: string | null;
   instructor: IInstructorProfile | null;
}

export interface IInstructorPublicProfile extends IInstructorProfile {
   department: { id: string; name: string; code?: string };
}

export interface IUpdateInstructorProfilePayload {
   address?: string;
   specialization?: string;
   designation?: string;
   contactNumber?: string;
}

export interface IInstructorListUser {
   id: string;
   name: string;
   email: string;
   imageUrl?: string | null;
   emailVerified: boolean;
   status: "ACTIVE" | "BLOCKED" | string;
}

export interface IInstructorListDepartment {
   id: string;
   name: string;
   code: string;
}

export interface IAdminInstructorListItem {
   id: string;
   instructorId: string;
   name: string;
   email: string;
   address?: string | null;
   specialization?: string | null;
   designation?: string | null;
   contactNumber?: string | null;
   resumeUrl?: string | null;
   resumePublicId?: string | null;
   departmentId: string;
   verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
   rejectionReason?: string | null;
   reviewedBy?: string | null;
   reviewedAt?: string | null;
   createdAt: string;
   updatedAt?: string;
   user: IInstructorListUser;
   department: IInstructorListDepartment;
}

export interface IGetAllInstructorsQuery {
   searchTerm?: string;
   page?: number;
   limit?: number;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
}

export interface IGetAllInstructorsResponse {
   success: boolean;
   message: string;
   data: IAdminInstructorListItem[];
   meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
   };
}

export interface IApproveInstructorPayload {
   instructorId: string;
   action: "APPROVE" | "REJECT";
   rejectionReason?: string;
}

export interface IApproveInstructorResult {
   id: string;
   instructorId: string;
   name: string;
   email: string;
   verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
   rejectionReason?: string | null;
   reviewedBy?: string | null;
   reviewedAt?: string | null;
}
