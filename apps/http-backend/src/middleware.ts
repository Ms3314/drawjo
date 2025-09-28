import {Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config" ;
import { verify } from "argon2";

export function middleware ( req : Request  , res : Response , next : NextFunction) {
    const token = req.headers["authorization"] ?? "" ;
    const decoded = jwt.verify(token , JWT_SECRET) ;
    if (decoded) {
        // @ts-ignore find how do u updaet the global ts types 
        req.userid = decoded ;
    } else {
        res.status(403).json({
            message : "Unauthorized"
        })
    }
}