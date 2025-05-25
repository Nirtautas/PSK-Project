import React from 'react'

import styles from './NotificationCard.module.scss'
import { Notification, NotificationType } from '@/types/types'
import { Button, Card, MenuItem } from '@mui/material'
import { useRouter } from 'next/navigation'
import { getPageUrl } from '@/constants/urls'

type Props = {
    notification: Notification
    onInvitationAccept: () => void
    onInvitationDecline: () => void
}

const NotificationCard = ({ notification, onInvitationAccept, onInvitationDecline }: Props) => {
    const router = useRouter()
    const handleClick = () => {
        if (notification.type === NotificationType.INVITATION) return
        if (notification.boardId) {
            router.push(getPageUrl.board(notification.boardId))
        }
    }

    return (
        <Card sx={{ marginBottom: '1rem' }}>
            <MenuItem
                onClick={handleClick}
                sx={{ flexDirection: 'column' }}
            >
                <div className={styles.container}>
                    <strong>{notification.title}</strong>
                    <br />
                    <sub>{notification.description}</sub>
                    <div className={styles.button_wrapper}>
                        {notification.type === NotificationType.INVITATION ? (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={onInvitationAccept}
                                >
                                    Join
                                </Button>
                                <Button
                                    sx={{ marginLeft: '1rem' }}
                                    variant="contained"
                                    color="error"
                                    onClick={onInvitationDecline}
                                >
                                    Decline
                                </Button>
                            </>
                        ) : (
                            <Button
                                sx={{ marginLeft: '1rem' }}
                                variant="contained"
                                color="error"
                                onClick={onInvitationDecline}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </MenuItem>
        </Card>
    )
}

export default NotificationCard
