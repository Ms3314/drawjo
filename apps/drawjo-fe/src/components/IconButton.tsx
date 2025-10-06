import React, { Dispatch, ReactNode, SetStateAction } from 'react'

const IconButton = ({
    icon , setSelectTools , name , selectedTools
} : {
    icon : ReactNode ,
    name : string ,
    setSelectTools : Dispatch<SetStateAction<string>> ,
    selectedTools : string
}) => {
    function onClick () {
        console.log("the tool" , name , "has been selected")
        setSelectTools(name) ;
    }
    return (
        <button className={`pointer rounded-full bg-black hover:bg-gray ${selectedTools === name ? 'bg-yellow-50' : ''} `} onClick={onClick}>
            {icon}
        </button>
    )
}

export default IconButton