import express from "express"
import argon2 from "argon2"
import jwt from "jsonwebtoken"

const app = express()

app.get("/" , (req , res)   => {
    res.json({
        "message" : "hello "
    })
})

app.post("api/v1/signup" , async (req , res) => {
    try {
        const {email , password} = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%^&*])(.{8,})$/;
        const validatedEmail = email.match(emailRegex);
        const validatedPassword = password.match(passwordRegex);
        if (!validatedEmail || !validatedPassword) {
            res.status(403).json({
                success : false,
                error : {
                    message : "Invalid Email or Password format"
                }
            })
        }
        const hash = await argon2.hash(password);
        // now i need to add this hash inside my prisma database 



        res.status(200).json({
            success : true,
            message : "User has been created successfully"
            
        })
    } catch (error) {
        res.status(500).json({
            status : false ,
            message : "An Internal server error occured"
        })
    }       

    // check if the email already is existing 

    // we need to hash the password 



    // then if they dont exist hash the password and add the user to the database 



})  


app.post("api/v1/signin" , async (req , res) => {
    const {email , password} = req.body;
    // check if the email exist and then if the password is correct or not 

    const hashedPassword = "sdjkfhsdjkfhskjhfkjsfs"
    // try to match it with the 
    const isSame = await argon2.verify(hashedPassword , password);
    if (!isSame) {
         res.status(404).json({
            success : false ,
            message : "Invalid credentials"
        })
    } 
    
    var token = jwt.sign({ email }, 'secretkeylol');

    res.status(200).json({
        success : true ,
        payload : {
            token : token 
        }
    })

})



app.listen(3005 , () => {
    console.log("server is running")
})