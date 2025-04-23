import { useState } from 'react'
import { Badge, Card, CircularProgress, IconButton, Menu, Skeleton } from '@mui/material'
import { Notifications as NotificationsIcon } from '@mui/icons-material'

import styles from './NotificationDropdown.module.scss'
import { Notification } from '@/types/types'
import NotificationCard from './NotificationCard'
import ErrorDisplay from '@/components/shared/ErrorDisplay'

type Props = {
    isLoading?: boolean
    errorMsg: string
    notifications: Notification[]
    onInvitationAccept: (notification: Notification) => void
}

const NotificationDropdown = ({ isLoading, errorMsg, notifications, onInvitationAccept }: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const isOpen = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const getNotificationHeaderContent = () => {
        if (isLoading) return (
            <span className={styles.notification_text}>
                ...Loading
            </span>
        )
        if (errorMsg) return (
            <ErrorDisplay msg={errorMsg} />
        )
        return (
            <span className={styles.notification_text}>
                {'You have '}
                <span className={notifications.length > 0 ? styles.notification_number_active : styles.notification_number}>{notifications.length}</span>
                {` ${notifications.length === 1 ? 'notification' : 'notifications'}:`}
            </span>
        )
    }

    const getNotificationContent = () => {
        if (isLoading) return (
            Array.from({ length: 5 }).map((x, i) => (
                <Skeleton variant="rounded" sx={{ width: '100%', height: '5rem', margin: '1rem 0' }} key={`notification-skeleton-${i}`}/>
            ))
        )
        if (errorMsg) return null
        return (notifications.sort((n1, n2) => new Date(n2.sendDate).getTime() - new Date(n1.sendDate).getTime()).map((notification) => (
            <NotificationCard key={`notification-${notification.id}`} notification={notification} onInvitationAccept={() => onInvitationAccept(notification)}/>
        )))
    }

    return (
        <div className={styles.container}>
            <Badge badgeContent={notifications?.length || ''} color="error" showZero>
                <Card elevation={2} sx={{ borderRadius: '25%' }}>
                    <IconButton onClick={handleClick}>
                        <NotificationsIcon fontSize="large" />
                    </IconButton>
                </Card>
            </Badge>
            <Menu
                anchorEl={anchorEl}
                onClose={handleClose}
                open={isOpen}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right', // Aligns the menu to the right of the anchor
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right', // Moves the menu towards the left
                }}
            >
                <div className={styles.dropdown_content}>
                    <div className={styles.content_wrapper}>
                        {getNotificationHeaderContent()}
                    </div>
                    <div className={styles.notifications_container}>
                        {getNotificationContent()}
                    </div>
                </div>
            </Menu>
        </div>
    )
}

export default NotificationDropdown
