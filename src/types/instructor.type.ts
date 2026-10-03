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
