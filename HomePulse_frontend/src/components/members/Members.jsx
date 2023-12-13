import axios from 'axios'
import React, { useEffect, useState } from 'react'
import MemberCompo from './MemberCompo'
import { Button, IconButton } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'
import { useQuery } from '@tanstack/react-query';
const { VITE_BACKEND_HOST } = import.meta.env

const Members = ({ teamID, access_token, ownerID }) => {

  const [members, setMembers] = useState([])
  const [showDelete, setShowDelete] = useState(false)

  // const { data, isLoading, isError, error, refetch } = useQuery({
  //   queryKey: ["members"],
  //   queryFn: () => axios.get(
  //     `${VITE_BACKEND_HOST}/api/1.0/groups/getMembers?teamID=${teamID}`,
  //     {
  //       headers: {
  //         Authorization: `bearer ${access_token}`
  //       }
  //     }
  //   )
  // })
  // if (!data) return
  const fetchMembers = () => {
    axios.get(
      `${VITE_BACKEND_HOST}/api/1.0/groups/getMembers?teamID=${teamID}`,
      {
        headers: {
          Authorization: `bearer ${access_token}`
        }
      }
    ).then(response => {
      setMembers(response.data)
    })
  }

  useEffect(() => {
    fetchMembers()
  }, [teamID])

  const handleRemoveMember = (member) => {
    Swal.fire({
      title: `Remove?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(
          `${VITE_BACKEND_HOST}/api/1.0/groups/removeMember`,
          {
            data: {
              ownerID: ownerID,
              memberID: member.userID,
              teamID: teamID
            },
            headers: {
              Authorization: `bearer ${access_token}`
            }
          }
        ).then(response => {
          if (response.status === 200) {
            Swal.fire({
              title: "Removed!",
              icon: "success"
            })
            fetchMembers()
          }
        })
      }
    })
  }

  return (
    <div className=''>
      <div id='titleContainer' className=' flex justify-between'>
        <div className='flex gap-5 items-center mb-3'>
          <div id='title' className='text-xl'>
            Members
          </div>
          <DeleteIcon onClick={() => setShowDelete(!showDelete)} className=" cursor-pointer" />
        </div>

        <div id='arrowIcon'>
          <IconButton>
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </div>

      <div className='flex gap-9 bg-white border rounded-3xl w-full p-5'>
        {
      
         members.map((member, idx) => (
            <div key={idx} className='flex flex-col items-center' >
              <MemberCompo member={member} access_token={access_token} />
              <div className={`${(member.role !== 'admin' && showDelete) ? 'flex' : 'hidden'}`}>
                <DeleteIcon color='error' onClick={() => handleRemoveMember(member)} className=" cursor-pointer" />
              </div>

            </div>

          ))
        }
      </div>
    </div>
  )
}

export default Members