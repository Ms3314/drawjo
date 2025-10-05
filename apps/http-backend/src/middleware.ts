import {Request , Response , NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config" ;

export function middleware ( req : Request  , res : Response , next : NextFunction) {
    try {
        const token = req.headers["authorization"] ?? "" ;
        const decoded  = jwt.verify(token , JWT_SECRET) ;
        if (decoded && typeof decoded === "object" && "userId" in decoded) {
            // we give back the user id to the next 
            req.userId = decoded.userId as string  ;
            next()
        } else {
            console.log("You are unauthorized" , token , decoded)
            res.status(403).json({
                message : "Unauthorized"
            })
        }
    } catch (error) {
        throw new Error("An error occured while checking token" + error)
    }
    
}