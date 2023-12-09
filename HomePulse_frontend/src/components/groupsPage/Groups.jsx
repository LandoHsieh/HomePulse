import React from 'react'
import GroupBtnCompo from './GroupBtnCompo'

const Groups = ({ userTeams, access_token, setGroupStatus, setTeam }) => {
    return (
        <div>
            {
                userTeams.map((team, idx) => (
                    <GroupBtnCompo key={idx} team={team} access_token={access_token} setGroupStatus={setGroupStatus} setTeam={setTeam} />
                ))
            }
        </div>
    )
}

export default Groups