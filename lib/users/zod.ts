import { object, string } from "zod";

export const LoginSchema = object({
  email: string().email("Invalid email. Email address not found."),
  password: string()
    .max(32, "Password must be less than 32 characters. ")
});

export const RegisterSchema = object({
  email: string().email("Invalid email. Email address not found."),
  username: string().min(1, "Username must be more than 1 character."),
  password: string()
    .max(32, "Password must be less than 32 characters. ")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.-])[A-Za-z\d@$!%*?&.-]{8,}$/,
      "Password doesn't match criteria. "
    ),
  confirmpassword: string()
    .max(32, "Password must be less than 32 characters. ")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.-])[A-Za-z\d@$!%*?&.-]{8,}$/,
      "Password doesn't match criteria. "
    ),
}).refine((data) => data.password === data.confirmpassword, {
  message: "Confirm password is incorrect.",
  path: ["confirmpassword"],
});

export const ProfileSchema = object({
  username: string().min(1, "Username must be more than 1 character."),
  password: string()
    .max(32, "Password must be less than 32 characters. ")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.-])[A-Za-z\d@$!%*?&.-]{8,}$/,
      "Password doesn't match criteria. "
    )
    .optional(),
});
