export interface InstructorApplicationData {
   user: {
      name: string;
      email: string;
   };
   instructor: {
      specialization: string;
      qualifications: string;
      experienceYears: number;
      contactNumber: string;
      address: string;
      bio: string;
   };
}

export interface InstructorApplicationPayload {
   resume: File;
   data: InstructorApplicationData;
}
