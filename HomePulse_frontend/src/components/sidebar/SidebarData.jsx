import React, { useState } from 'react'
import { datas } from './Data'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedPage } from '../../store/sidebarSlice'
import { setLogout } from '../../store/userSlice'

const SidebarData = ({ toggle }) => {
    const state = useSelector((state) => state.sidebar)
    const dispatch = useDispatch()

    const navigate = useNavigate()
    

    const handleButtonClick = (page, pageName) => {
        
        if(pageName === 'Logout'){
            dispatch(setLogout())
            dispatch(setSelectedPage(1))
            localStorage.clear()
            navigate('/Login')
        }else{
            dispatch(setSelectedPage(page))
            navigate(`/${pageName}`)
        }
        
    }


    return (
        <div className=''>
            {datas.map((data) => {
                return (
                    <div 
                        key={data.id} 
                        className={`${toggle ? "last:w-[3.6rem]" : "last:w-[17rem]"} sidebar 
                                    last:absolute left-4 bottom-4 ${state.selectedPage === data.id ? " bg-white" : ""}`} 
                        onClick={() => handleButtonClick(data.id, data.text)}
                        >

                        <div className=' mr-8 text-[1.7rem]'>{data.icon}</div>
                        <div className={`${toggle ? " opacity-0 delay-100 " : ""} text-[1rem] whitespace-pre`}>{data.text}</div>
                    </div>
                )
            })}

        </div>
    )
}

export default SidebarData