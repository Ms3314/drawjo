"use client"
import axios, { AxiosResponse } from 'axios'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Router, useRouter } from 'next/router'
import { handleSubmitSignupOp } from '@/app/signup/page'
import { handleSubmitSignInOp } from '@/app/signin/page'

const AuthPage = ({isSignin   } : {isSignin : boolean }) => {
    const [name , setName] = useState<String>("")
    const [email , setEmail] = useState<string>("")
    const [pass , setPass] = useState<string>("")
    if (isSignin == false) {
        return <div className='w-screen h-screen flex justify-center items-center'>
            <input onChange={(e)=>setName(e.target.value)} type="name" />
            <input onChange={(e)=>setEmail(e.target.value)} type="email" />
            <input onChange={(e)=>setPass(e.target.value)} type="pass" />
            <button className='p-5 rounded-xl' onClick={() => handleSubmitSignupOp({
                username : name ,
                email ,
                password : pass 
            })}>Submit</button>
    </div>
    }
    if (isSignin == true) {
        return <div className='w-screen h-screen flex justify-center items-center'>
            <input onChange={(e)=>setEmail(e.target.value)} type="email" />
            <input onChange={(e)=>setPass(e.target.value)} type="pass" />
            <button className='p-5 rounded-xl' onClick={() => handleSubmitSignInOp({
                email ,
                password : pass 
            })}>Submit</button>
            </div>
    }
}

export default AuthPage