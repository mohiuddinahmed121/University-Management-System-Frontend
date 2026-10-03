export interface RegistrationPayload {
   name: string;
   email: string;
   password: string;
   student: {
      contactNumber?: string;
      programId: string;
   };
}

export interface LoginPayload {
   email: string;
   password: string;
}

export interface VerifyAccountPayload {
   email: string;
   otp: string;
}
