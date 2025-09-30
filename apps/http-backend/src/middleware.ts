import {Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config" ;

export function middleware ( req : Request  , res : Response , next : NextFunction) {
    const token = req.headers["authorization"] ?? "" ;
    const decoded = jwt.verify(token , JWT_SECRET) ;
    if (decoded) {
        // we give back the user id to the next 
        // @ts-ignore find how do u updaet the global ts types 
        req.userid = decoded ;
        next()
    } else {
        res.status(403).json({
            message : "Unauthorized"
        })
    }
}