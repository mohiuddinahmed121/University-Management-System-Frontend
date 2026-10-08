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
