export type UserRole = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export interface IUploadProfileImageResponse {
   success: boolean;
   message: string;
   data: {
      id: string;
      imageUrl?: string | null;
      imagePublicId?: string | null;
   };
}
