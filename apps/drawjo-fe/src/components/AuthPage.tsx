"use client"
import axios, { AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { HTTP_BACKEND } from '../../config'
import { Router, useRouter } from 'next/router'

const AuthPage = async ({isSignin , handleSubmit} : {isSignin : boolean , handleSubmit : () => null}) => {
    const [name , setName] = useState<String>("")
    const [email , setEmail] = useState<string>("")
    const [pass , setPass] = useState<string>("")
    const router = useRouter() 
    
    async function handleSubmitSignIn () {
        console.log("the form has been submitted")
        const response:AxiosResponse =  await axios.post(`${HTTP_BACKEND}/signin` , {
                email ,
                password : pass 
        })
        localStorage.setItem("token" , response.data.token) ;
    }
    if (!isSignin) {
        return <div className='w-screen h-screen flex justify-center items-center'>
            <input onChange={(e)=>setName(e.target.value)} type="name" />
            <input onChange={(e)=>setEmail(e.target.value)} type="email" />
            <input onChange={(e)=>setPass(e.target.value)} type="pass" />
            <button className='p-5 rounded-xl' onClick={handleSubmit}>Submit</button>
    </div>
    }
    if (isSignin) {
        return <div className='w-screen h-screen flex justify-center items-center'>
            <input onChange={(e)=>setEmail(e.target.value)} type="email" />
            <input onChange={(e)=>setPass(e.target.value)} type="pass" />
            <button className='p-5 rounded-xl' onClick={handleSubmit}>Submit</button>
    </div>
    }
}

export default AuthPage