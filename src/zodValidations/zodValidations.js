import { z } from 'zod';


const emailSchema = z.string().email({ message: "Invalid email address" });


const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });


const userNameSchema = z.string()
  .min(2, { message: "Full name must be at least 2 characters long" })
  .regex(/^[a-zA-Z\s]+$/, { message: "Full name can only contain letters and spaces" });


  const vlogTitle = z.string()
  .min(2,{message: "Title should be at least 2 characters long"})
  .regex(/^[a-zA-Z\s]+$/,{message:"Title can only contain letters and spaces"});

  const vlogDescription = z.string()
  .min(10,{message: "Description should be at least 10 characters long"})



export const userLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgetPasswordSchema = z.object({
    email:emailSchema
});


export const userSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userName: userNameSchema,
});

export const passwordResetSchema = z.object({
  email: emailSchema,
  password:passwordSchema
});

export const vlogSchema = z.object({
 title:vlogTitle,
 description:vlogDescription
});