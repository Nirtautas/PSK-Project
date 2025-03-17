'use client'

import {Box, Paper, Typography} from '@mui/material'

import styles from './NavBarLayout.module.scss'
import UserProfile from '@/components/templates/NavBarLayout/UserProfile'
import NotificationButton from '@/components/templates/NavBarLayout/NotificationButton'

type Props = {
    children: React.ReactNode
}

const NavBarLayout = ({ children }: Props) => {
    return (
        <Paper>
            <header>
                <Paper className={styles.navbar}>
                    <div className={styles.start_container}>
                        <Typography variant="h2">Worth Manager</Typography>
                    </div>
                    <div className={styles.end_container}>
                        <Box className={styles.notification_button_wrapper}>
                            <NotificationButton notifications={[
                                {
                                    component: <Typography>Notification 1</Typography>,
                                    onClick: () => {
                                        console.log('Notification 1')
                                    }
                                },
                                {
                                    component: <Typography>Notification 2</Typography>,
                                    onClick: () => {
                                        console.log('Notification 2')
                                    }
                                }
                            ]}
                            />
                        </Box>
                        <Box className={styles.centered_wrapper}>
                            <UserProfile
                                name="placeholder"
                                imageUrl="https://preview.colorkit.co/color/ff0000.png?static=true"
                                buttons={[
                                    {
                                        label: 'Logout',
                                        onClick: () => {
                                            console.log('Logout')
                                        }
                                    },
                                    {
                                        label: 'Settings',
                                        onClick: () => {
                                            console.log('Settings')
                                        }
                                    }
                                ]}
                            />
                        </Box>
                    </div>
                </Paper>
            </header>
            <main>
                {children}
            </main>
        </Paper>
    )
}

export default NavBarLayout
