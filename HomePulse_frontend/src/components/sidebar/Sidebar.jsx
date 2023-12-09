import React, { useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UserProfile from './UserProfile';
import SidebarData from './SidebarData';
import { useDispatch, useSelector } from 'react-redux';
import { setToggle } from '../../store/sidebarSlice';
const Sidebar = ({userProfile}) => {
    const toggleState = useSelector((state) => state.sidebar)
    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()
    
    return (
        
        <div className={`${toggleState.toggle ? "w-[5.8rem]" : ""} sidebar-container`}>

            <UserProfile toggle={toggleState.toggle} userProfile={userProfile}/>
            <SidebarData toggle={toggleState.toggle}/>
            <div className='absolute top-[7rem] flex justify-center items-center -left-5
                        w-10 h-10 bg-slate-300 rounded-full cursor-pointer'
                onClick={() => {
                    dispatch(setToggle(!toggleState.toggle))
                }}
            >
                <ChevronRightIcon 
                    className={`border rounded-full ${toggleState.toggle ? "rotate-180" : ""} 
                                transition-all duration-300`}
                    fontSize='large' />
            </div>
        </div>
    )
}

export default Sidebar