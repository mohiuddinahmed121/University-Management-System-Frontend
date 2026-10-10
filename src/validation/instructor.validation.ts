import z from "zod";

export const MAX_FILE_SIZE = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = [
   "application/pdf",
   "application/msword",
   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
   "image/png",
   "image/jpeg",
];

export function isAcceptedFileSize(fileSize: number) {
   return fileSize <= MAX_FILE_SIZE_BYTES;
}

export function isAcceptedFileType(fileType: string) {
   return ACCEPTED_FILE_TYPES.includes(fileType);
}

export const getCustomFileSchema = <T>(message: string) =>
   z.custom<T>(
      (value) =>
         value instanceof File && isAcceptedFileSize(value.size) && isAcceptedFileType(value.type),
      { message },
   );

export const applyAsInstructorSchema = z.object({
   user: z.object({
      name: z.string().trim().min(2, "Full name must be at least 2 characters long"),
      email: z.email("Please enter a valid email address"),
   }),
   instructor: z.object({
      address: z.string().trim().min(5, "Address must be at least 5 characters long").optional(),
      specialization: z
         .string()
         .trim()
         .min(2, "Specialization must be at least 2 characters long")
         .optional(),
      designation: z
         .string()
         .trim()
         .min(2, "Designation must be at least 2 characters long")
         .optional(),
      contactNumber: z.string().trim().min(5, "Contact number is invalid").optional(),
      departmentId: z.string().min(1, "Department is required"),
   }),
   resume: getCustomFileSchema<File>(
      `Resume must be a PDF, DOC, DOCX or an image file under ${MAX_FILE_SIZE}MB`,
   ),
});

export const instructorApplyFormSchema = z.object({
   name: z.string().trim().min(2, "Full name must be at least 2 characters long"),
   email: z.email("Please enter a valid email address"),
   phone: z.string().trim().min(5, "Contact number is invalid"),
   address: z.string().trim(),
   specialization: z.string().trim(),
   designation: z.string().trim(),
   departmentId: z.string().min(1, "Department is required"),
   resume: getCustomFileSchema<File | null>(
      `Resume must be a PDF, DOC, DOCX or an image file under ${MAX_FILE_SIZE}MB`,
   ).refine((value) => value instanceof File, {
      message: "A resume or CV is required",
   }),
});

export const updateInstructorProfileSchema = z.object({
   address: z.string().trim().min(5, "Address must be at least 5 characters long").optional(),
   specialization: z
      .string()
      .trim()
      .min(2, "Specialization must be at least 2 characters long")
      .optional(),
   designation: z
      .string()
      .trim()
      .min(2, "Designation must be at least 2 characters long")
      .optional(),
   contactNumber: z.string().trim().min(5, "Contact number is invalid").optional(),
});
