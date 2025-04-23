import React from 'react'

import styles from './NotificationCard.module.scss'
import { Notification, NotificationType } from '@/types/types'
import { Button, Card, MenuItem } from '@mui/material'
import NotificationApi from '@/api/notification.api'

type Props = {
    notification: Notification
    onInvitationAccept: () => void
}

const NotificationCard = ({ notification, onInvitationAccept }: Props) => {
    const handleClick = () => {
        // if ()
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
                        {notification.type === NotificationType.INVITATION && (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => onInvitationAccept()}
                            >
                                Join
                            </Button>
                        )}
                    </div>
                </div>
            </MenuItem>
        </Card>
    )
}

export default NotificationCard
