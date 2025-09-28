import express from "express"
import argon2 from "argon2"
import jwt from "jsonwebtoken" 
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateUserSchema} from "@repo/common/types"

const app = express(); 

// we need to make a signup route 
// we need to make a signin route 
// we also need to make create room route 

app.post("/signup" , async (req , res) => {
    const {name , email , password} = req.body ;
    const data = CreateUserSchema.safeParse(req.body) ; 
    if (!data.success) {
        return res.json({
            message : "Incorrect Inputs"
        })
    }
    // check if there exiss an email already 
    const hash = await argon2.hash(password);
    // store this hash inside the db 

    // now create a jwt token out of the email and send it to the client
    const token = jwt.sign({
        email
    } , JWT_SECRET) ;
    return res.status(200).json({
        token
    })
})

app.post("/signin" , (req , res) => {

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
