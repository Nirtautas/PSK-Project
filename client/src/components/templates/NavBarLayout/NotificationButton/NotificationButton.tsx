import { useState } from 'react'
import { Badge, Card, IconButton, Menu, MenuItem } from '@mui/material'
import { Notifications as NotificationsIcon } from '@mui/icons-material'

import styles from './NotificationButton.module.scss'

type Notification = {
    component: React.ReactNode
    onClick: () => void
}

type Props = {
    notifications: Notification[]
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
            <Badge badgeContent={4} color="error" showZero>
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
            >
                {notifications.map((notification, index) => (<MenuItem key={index} onClick={notification.onClick}>
                    {notification.component}
                </MenuItem>))}
            </Menu>
        </div>
    )
}

export default NotificationButton
