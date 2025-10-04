import AuthPage from '@/components/AuthPage'
import axios, { AxiosResponse } from 'axios'
import React from 'react'
import { HTTP_BACKEND } from '../../../config';
// import { useRouter } from 'next/router';

export async function handleSubmitSignupOp (data:any) {
        console.log("the form has been submitted")
        // const router = useRouter() 
        const response:AxiosResponse =  await axios.post(`http://localhost:3003/signup` , data)
        // router.push('/signin')
}

const page = () => {
  return (
    <AuthPage isSignin={false}  />
  )
}

export default page