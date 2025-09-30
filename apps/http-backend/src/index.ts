import express from "express"
import argon2 from "argon2"
import jwt from "jsonwebtoken" 
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateUserSchema , SigninSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/db" 

const app = express(); 
app.use(express.json())
// we need to make a signup route 
// we need to make a signin route 
// we also need to make create room route 

app.post("/signup" , async (req , res) => {
    try {
        const {username  , email , password} = req.body ;
        const pdata = CreateUserSchema.safeParse(req.body) ; 
        if (!pdata.success) {
            return res.json({
                message : "Incorrect Inputs"
            })
        }
        // check if there exiss an email already 
        const hash = await argon2.hash(pdata.data.password);
        const doesEmailAlreadyExists = await prismaClient.user.findFirst({
            where : {
                email : pdata.data.email 
            }
        })
        if (doesEmailAlreadyExists?.email) {
            return res.status(402).json({
                message : "the email has been already used"
            })
        }
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
        return res.status(200).json({
            userId : response.id , 
            message : "User has beeen created succesfully"
        })
    } catch (error) {
        return res.status(500).json({
            message : "An Internal Error has occured" ,
            error  : error 
        })
    }
    
})

app.post("/signin" ,async  (req , res) => {
    try {
        const {email , password } = req.body ; 
        const data = SigninSchema.safeParse(req.body) ; 
        const responseData = await prismaClient.user.findUnique({
            where : {
                email
            } ,
        })
        if (!responseData) {
            return res.json(403).json({
                message : "Invalid credentials"
            })
        }
        if (await argon2.verify(responseData?.password , password)) {
            const userId = 33 
            const token = jwt.sign({
                userId 
            } , JWT_SECRET) ;
            return res.status(200).json({
                message : "User is valid and credentials are correct" , 
                token
            })
        } else {
            return res.json(403).json({
                message : "Invalid Credentials"
            })
        }
    } catch (error) {
        res.status(500).json({
            message : "An Error has occured" ,
            error 
        })   
    }
} )

app.post('create-room' , middleware , async  (req , res) => {
    // the room id is bring given out 
    const userId = req.userId 
    const response = await prismaClient.user.findUnique({
        where : {
            id : userId.toString()
        }
    })
    if (!response) {
        return res.status(405).json({
            message : "Invalid Credentials"
        })
    }
    const slug : string = response?.email.split('@')[0] + (Math.floor((Math.random() * 5 )*10000)).toString() 

    const roomCreated = await prismaClient.room.create({
        data : {
            slug  ,
            adminId : userId.toString() ,
            name : response?.username 
        }
    })
    res.json({
        roomid : roomCreated.id 
    })
})



app.listen(3000 , () => {
    console.log("App is listening on port 3000");
})
