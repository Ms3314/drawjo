import {Request , Response , NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config" ;

export function middleware ( req : Request  , res : Response , next : NextFunction) {
    const token = req.headers["authorization"] ?? "" ;
    console.log("this is the token" , token)
    const decoded  = jwt.verify(token , JWT_SECRET) ;
    if (decoded) {
        // we give back the user id to the next 
        req.userId = decoded.userId as string  ;
        next()
    } else {
        res.status(403).json({
            message : "Unauthorized"
        })
    }
}