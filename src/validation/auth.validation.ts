import z from "zod";

export const loginSchema = z.object({
   email: z.email(),
   password: z
      .string()
      .min(8, "Password Must Minimum 8 Characters Long.")
      .regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter")
      .regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter")
      .regex(/[0-9]/, "Password must contain at least 1 Number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 Special Character"),
});

export const studentRegistrationSchema = z
   .object({
      name: z.string().trim().min(3, "Name must be at least 3 characters long").max(50),
      email: z.email("Please provide a valid email"),
      password: z
         .string()
         .min(8, "Password Must Minimum 8 Characters Long.")
         .regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
         .regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")
         .regex(/[0-9]/, "Password must contain atleast 1 Number")
         .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
      contactNumber: z.string().trim(),
      programId: z.string().min(1, "Program is required"),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Password do not match",
      path: ["confirmPassword"],
   });
