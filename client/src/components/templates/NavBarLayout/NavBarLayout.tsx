'use client'

import { Box, MenuItem, Paper, Typography } from '@mui/material'

import styles from './NavBarLayout.module.scss'
import UserProfile from '@/components/templates/NavBarLayout/UserProfile'
import NotificationButton from '@/components/templates/NavBarLayout/NotificationButton'
import { useRouter } from 'next/navigation'
import { getPageUrl } from '@/constants/urls'
import useFetch from '@/hooks/useFetch'
import NotificationApi from '@/api/notification.api'
import { Notification } from '@/types/types'

type Props = {
    children: React.ReactNode
}

const NavBarLayout = ({ children }: Props) => {
    const router = useRouter()
    const {
        data,
    } = useFetch({ resolver: () => NotificationApi.getNotifications()})
    const notifications = data?.items || []

    // @ts-ignore
    return (
        <div className={styles.layout}>
            <header>
                <Paper className={styles.navbar}>
                    <div className={styles.start_container}>
                        <Typography variant="h2">Worth Manager</Typography>
                    </div>
                    <div className={styles.end_container}>
                        <Box className={styles.notification_button_wrapper}>
                            <NotificationButton notifications={notifications.map((notification: Notification) => (
                                <MenuItem
                                    // TODO: create notification component
                                    key={notification.id}
                                    onClick={() => console.log('IMPLEMENT ME')}
                                >
                                    <div>
                                        <strong>{notification.title}</strong>
                                        <br />
                                        <sub>{notification.description}</sub>
                                    </div>
                                </MenuItem>
                            ))}/>
                        </Box>
                        <Box className={styles.centered_wrapper}>
                            <UserProfile
                                name="placeholder"
                                imageUrl="https://preview.colorkit.co/color/ff0000.png?static=true"
                                buttons={[
                                    {
                                        label: 'My Boards',
                                        onClick: () => {
                                            router.push(getPageUrl.boards())
                                        }
                                    },
                                    {
                                        label: 'Settings',
                                        onClick: () => {
                                            router.push(getPageUrl.settings())
                                        }
                                    },
                                    {
                                        label: 'Log out',
                                        onClick: () => {
                                            router.push(getPageUrl.logout())
                                        }
                                    },
                                ]}
                            />
                        </Box>
                    </div>
                </Paper>
            </header>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}

export default NavBarLayout
