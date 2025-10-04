import AuthPage from '@/components/AuthPage'
import { AxiosResponse } from 'axios'
import React from 'react'

const page = () => {
    async function handleSubmitSignup () {
        console.log("the form has been submitted")
        const response:AxiosResponse =  await axios.post(`${HTTP_BACKEND}/signup` , {
                username : name ,
                email ,
                password : pass 
        })
        router.push('/signUp')
    }
  return (
    <AuthPage isSignin={false} handleSubmit={} />
  )
}

export default page