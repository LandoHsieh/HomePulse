import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const StoreGroupInvitePage = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    let group_token = queryParams.get('token')

    useEffect(() => {
        localStorage.setItem('group_invite', group_token)
        navigate('/Login')
    }, [])
    

    
  return (
    <div>StoreGroupInvitePage</div>
  )
}

export default StoreGroupInvitePage