import { useState } from 'react'
import { Badge, Card, IconButton, Menu } from '@mui/material'
import { Notifications as NotificationsIcon } from '@mui/icons-material'

import styles from './NotificationButton.module.scss'


type Props = {
    notifications: React.ReactNode[]
}

const NotificationButton = ({ notifications }: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const isOpen = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div className={styles.container}>
            <Badge badgeContent={notifications.length} color="error" showZero>
                <Card elevation={2} sx={{ borderRadius: '25%' }}>
                    <IconButton onClick={handleClick}>
                        <NotificationsIcon fontSize="large"/>
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
                        <span className={styles.notification_text}>
                            {'You have '}
                            <span className={notifications.length > 0 ? styles.notification_number_active : styles.notification_number}>{notifications.length}</span>
                            {` ${notifications.length === 1 ? 'notification' : 'notifications'}:`}
                        </span>
                    </div>
                    {notifications}
                </div>
            </Menu>
        </div>
    )
}

export default NotificationButton
