import React, { useState } from 'react'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import LinkIcon from '@mui/icons-material/Link';
import { Alert, Button, Collapse, Snackbar } from '@mui/material';
import Swal from 'sweetalert2'
import axios from 'axios';
import CopyToClipboard from 'react-copy-to-clipboard';


const { VITE_BACKEND_HOST } = import.meta.env

const ShareLink = ({ teamID, teamName, access_token }) => {

    const [showPopup, setShowPopup] = useState(false)
    const [shareLink, setShareLink] = useState('')
    const [copiedFeedback, setCopiedFeedback] = useState(false)
    const handleOnCopy = () => {
        setCopiedFeedback(true)
        setShowPopup(false)
    }
    const handleCopiedFeedbackClosed = () => {
        setCopiedFeedback(false)
    }
    const genShareLink = () => {
        if (showPopup) {
            setShowPopup(false)
        } else {
            axios.post(
                `${VITE_BACKEND_HOST}/api/1.0/groups/genShareLink`,
                {
                    groupID: teamID,
                    groupName: teamName
                },
                {
                    headers: {
                        Authorization: `bearer ${access_token}`
                    }
                }
            ).then(response => {
                console.log("genShareLink: ", response.data)
                setShareLink(response.data)
                setShowPopup(true)
            })
        }

    }

    return (
        <div className=' flex gap-3 items-center '>
            <ShareOutlinedIcon className=' cursor-pointer' onClick={genShareLink} />
            {
                showPopup && (
                    <div className="flex items-center bg-white bg-opacity-60 rounded-lg p-1 ">
                        <CopyToClipboard text={shareLink} onCopy={handleOnCopy}>
                            <Button variant="outlined" startIcon={<LinkIcon />}>
                                Copy link
                            </Button>
                        </CopyToClipboard>

                    </div>
                )
            }
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={handleCopiedFeedbackClosed} open={copiedFeedback} autoHideDuration={6000}>
                <Alert onClose={handleCopiedFeedbackClosed} severity="success" sx={{ width: '100%' }}>
                    Share link copied!
                </Alert>
            </Snackbar>
            {/* <Collapse in={shareClicked}>
                <Alert variant="outlined" severity="success">
                    This is a success alert — check it out!
                </Alert>
            </Collapse> */}

        </div>
    )
}

export default ShareLink