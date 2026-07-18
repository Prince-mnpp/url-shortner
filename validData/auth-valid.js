import z from "zod";

export const registerUserSchema = z.object({
  name: z.string().trim().min(3, {message: "name must be atleast 3 characters"})
        .max(100, {message: "name must not be longer than 100 characters bruhh"}),
      
  email: z.string().trim().email({message: "please enter a valid email"})
          .max(100, {message : "email must be shorter than 100 characs"}),

  password: z.string().min(6, {message: "must be 6 letters atleast"}).max(100, {message: "must be less than 100 letters"}),
});

export const loginUserSchema = z.object({
  // name: z.string().trim().min(3, {message: "name must be atleast 3 characters"})
  //       .max(100, {message: "name must not be longer than 100 characters bruhh"}),
      
  email: z.string().trim().email({message: "please enter a valid email"})
          .max(100, {message : "email must be shorter than 100 characs"}),

  password: z.string().min(6, {message: "must be 6 letters atleast"}).max(100, {message: "must be less than 100 letters"}),
});