import {z} from "zod" 

export const CreateUserSchema = z.object({
    username : z.string().min(3).max(20) ,
    password : z.string().min(8, "Must be at least 8 characters")
  .regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, "Must contain at least one letter and one number") ,
    email : z.string().min(3) 
})

export const SigninSchema = z.object({
    email : z.string().min(3).max(20) ,
    password : z.string().min(8, "Must be at least 8 characters")
  .regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, "Must contain at least one letter and one number") ,
})

export const createRoomSchema = z.object({
    name : z.string().min(3).max(20) ,  
})