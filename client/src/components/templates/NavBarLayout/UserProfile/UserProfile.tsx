'use client'

import { Card, CardActionArea, Menu, MenuItem, Typography } from '@mui/material'
import {useState} from 'react'

import styles from './UserProfile.module.scss'

type Props = {
    name: string
    imageUrl: string
    buttons: {
        label: string
        onClick: () => void
    }[]
}

const UserProfile = ({
    name,
    imageUrl,
    buttons
}: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const isOpen = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <Card className={styles.container} elevation={2}>
            <CardActionArea
                onClick={handleClick}
                sx={{
                    display: 'flex',
                    height: '100%',
                }}
            >
                <div className={styles.content}>
                    <Typography variant="h6">{name}</Typography>
                    <img width={50} height={50} src={imageUrl} alt="image" />
                </div>
            </CardActionArea>

            <Menu
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            width: `${anchorEl?.offsetWidth}px`,
                        }
                    }
                }}
            >
                {buttons.map((button, index) => (
                    <MenuItem key={index} onClick={button.onClick}>
                        {button.label}
                    </MenuItem>
                ))}
            </Menu>
        </Card>
    )
}

export default UserProfile
