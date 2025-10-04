import AuthPage from '@/components/AuthPage'
import axios, { AxiosResponse } from 'axios';
import React from 'react'
import { HTTP_BACKEND } from '../../../config';

export async function handleSubmitSignInOp(data : any) {
        console.log("the form has been submitted")
        const response:AxiosResponse =  await axios.post(`http://localhost:3003/signin` , data)
        localStorage.setItem("token" , response.data.token);
}

const page = () => {
  return (
    <AuthPage isSignin={true}   />
  )
}
export default page