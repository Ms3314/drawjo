import express from "express"
import argon2 from "argon2"
import jwt from "jsonwebtoken" 
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {createRoomSchema, CreateUserSchema , SigninSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/db" 
import cors from "cors"

const app = express(); 
app.use(express.json())
app.use(cors())
// we need to make a signup route 
// we need to make a signin route 
// we also need to make create room route 

app.post('/create-room' , middleware , async  (req , res) => {
    // the room id is bring given out 
    try {
        const roomname = createRoomSchema.safeParse(req.body) ; 
        if (!roomname.success) {
            return res.status(402).json({
                message : "Invalid Credentials"
            })
        }
        const userId = req.userId
        console.log(userId) 
        if (!userId) {
            console.log(userId)
            return ;
        }
        const response = await prismaClient.user.findUnique({
            where : {
                id : userId
            }
        })
        if (!response) {
            console.log(response , "this is the response");
            return res.status(405).json({
                message : "Invalid Credentials"
            })
        }
        const slug : string = response?.email.split('@')[0] + (Math.floor((Math.random() * 5 )*10000)).toString() 
        const doesTheSamePersonHaveTheSameName = await prismaClient.room.findFirst({
            where : {
               adminId : userId ,  
               name : roomname.data?.name   
            }
        })
        if (doesTheSamePersonHaveTheSameName) {
            res.status(403).json({
                message : "you cannot have duplicate room Names"
            })
        }
        const roomCreated = await prismaClient.room.create({
            data : {
                slug  ,
                adminId : userId.toString() ,
                name : roomname.data?.name 
            }
        })
        return res.json({
            name : roomCreated.name , 
            roomid : roomCreated.id 
        })
    } catch (error) {
        return res.status(500).json({
            error 
        })
    }
    
})

app.post("/signup", async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(500).json({
                message: "Credentials missing"
            });
        }
        
        const pdata = CreateUserSchema.safeParse(req.body);
        if (!pdata.success) {
            return res.json({
                message: "Incorrect Inputs"
            });
        }

        const doesEmailAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: pdata.data.email 
            }
        });
        
        if (doesEmailAlreadyExists?.email) {
            return res.status(402).json({
                message: "the email has been already used"
            });
        }
        console.log(pdata.data.username)
        const hash = await argon2.hash(pdata.data.password);
        const response = await prismaClient.user.create({
            data: {
                username: pdata.data?.username,
                email: pdata.data?.email,
                password: hash 
            }
        });

        if (!response) {
            return res.status(500).json({
                message: "An Internal Error Has Occured related to the DB"
            });
        }

        return res.status(200).json({
            userId: response.id,
            message: "User has beeen created succesfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An Internal Error has occured",
            error: error
        });
    }
});

app.post("/signin", async (req, res) => {
    try {
        console.log("Sign in has been initiated");
        const parsedData = SigninSchema.safeParse(req.body);
        
        if (!parsedData.success) {
            console.log(parsedData.error , "this is the error")
            return res.status(400).json({
                message: "Invalid input format"
            });
        }

        const responseData = await prismaClient.user.findFirstOrThrow({
            where: {
                email: parsedData.data.email
            }
        });
        
        if (!responseData) {
            return res.status(403).json({
                message: "Invalid credentials"
            });
        }

        const isPasswordCorrect = await argon2.verify(responseData.password, parsedData.data.password);

        if (!isPasswordCorrect) {
            return res.status(402).json({
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign({
            userId: responseData.id
        }, JWT_SECRET);

        return res.status(200).json({
            message: "User is valid and credentials are correct",
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An Error has occured",
            error
        });
    }
});

app.get('/chat/:roomId' , middleware , async (req , res) => {
    try {
        console.log("This is hit")
        const userId = req.userId ; 
        const roomId = Number(req.params.roomId) ;
        const chats = await prismaClient.chat.findMany({
            where : {
                roomId : roomId ,
                userId ,
            } ,
            orderBy : {
                id : "desc"
            } ,
            take : 50
        })
        if (!chats) {
            return res.status(402).json({
                message : "Invalid Parameters"
            })
        }
        return res.status(200).json({
            message : "The Chat is :" ,
            chats : chats
        })
    } catch (error) {
        return res.status(500).json({
            error ,
            message : "An error has occured"
        })
    }
})

app.listen(3003 , () => {
    console.log("App is listening on port 3003");
})
