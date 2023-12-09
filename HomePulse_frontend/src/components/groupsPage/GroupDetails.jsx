import { Box, Tab, Tabs, Typography } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab/';
import React, { useState } from 'react'
import GroupMonitors from './GroupMonitors';
import GroupControllers from './GroupControllers';
import GroupLogs from './GroupLogs';
import { SocketProvider } from '../monitorPage/SocketComponent';

const GroupDetails = ({ team, access_token, userProfile }) => {
    //team: teamID, ownerID
    const [value, setValue] = useState('1')
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    return (
        <Box sx={{ width: '100%', height:'100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="">
                        <Tab label="Monitor" value="1" />
                        <Tab label="Controller" value="2" />
                        <Tab label="Usage log" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <SocketProvider>
                        <GroupMonitors team={team} access_token={access_token} />
                    </SocketProvider>
                </TabPanel>
                <TabPanel value="2">
                    <SocketProvider>
                        <GroupControllers team={team} access_token={access_token} userProfile={userProfile} />
                    </SocketProvider>
                </TabPanel>
                <TabPanel value="3">
                    <SocketProvider>
                        <GroupLogs team={team} access_token={access_token} />
                    </SocketProvider>
                </TabPanel>
            </TabContext>
        </Box>

    )
}

export default GroupDetails