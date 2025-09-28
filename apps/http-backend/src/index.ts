import express from "express"
import argon2 from "argon2"
import jwt from "jsonwebtoken" 
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateUserSchema , SigninSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/db" 

const app = express(); 

// we need to make a signup route 
// we need to make a signin route 
// we also need to make create room route 

app.post("/signup" , async (req , res) => {
    try {
        
    } catch (error) {
        
    }
    const {username  , email , password} = req.body ;
    const pdata = CreateUserSchema.safeParse(req.body) ; 
    if (!pdata.success) {
        return res.json({
            message : "Incorrect Inputs"
        })
    }
    // check if there exiss an email already 
    const hash = await argon2.hash(pdata.data.password);
    // store this hash inside the db 
    const response = await prismaClient.user.create({
        data : {
            username : pdata.data?.username ,
            email : pdata.data?.email ,
            password : hash 
        }
    })
    if (!response) {
        return res.status(500).json({
            message : "An Internal Error Has Occured related to the DB "
        })
    }
    // now create a jwt token out of the email and send it to the client
   return res.json({
    userId : "3232"
   })
})

app.post("/signin" , (req , res) => {
    const {username , password } = req.body ; 
    const data = SigninSchema.safeParse(req.body) ; 
    const userId = 33 
     const token = jwt.sign({
        userId 
    } , JWT_SECRET) ;
    return res.status(200).json({
        token
    })
} )

app.post('create-room' , middleware , (req , res) => {
    // the room id is bring given out 
    res.json({
        roomid : 122323
    })
})



app.listen(3000 , () => {
    console.log("App is listening on port 3000");
})
