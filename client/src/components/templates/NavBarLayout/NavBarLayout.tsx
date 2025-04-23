'use client'

import { Box, MenuItem, Paper, Skeleton, Typography } from '@mui/material'

import styles from './NavBarLayout.module.scss'
import UserProfile from '@/components/templates/NavBarLayout/UserProfile'
import NotificationButton from '@/components/templates/NavBarLayout/NotificationDropdown'
import { usePathname, useRouter } from 'next/navigation'
import { getPageUrl, pathnames } from '@/constants/urls'
import useFetch from '@/hooks/useFetch'
import NotificationApi from '@/api/notification.api'
import { Notification } from '@/types/types'
import { removeUserId } from '@/utils/userId'
import { deleteCookie } from 'cookies-next'
import { GetPageUrl } from '@/constants/route'
import useFetchResponse from '@/hooks/useFetchResponse'
import NotificationDropdown from '@/components/templates/NavBarLayout/NotificationDropdown'

type Props = {
    children: React.ReactNode
}

const NavBarLayout = ({ children }: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const {
        isLoading,
        errorMsg,
        data: notifications,
        setData: setNotifications
    } = useFetchResponse({ resolver: () => NotificationApi.getAll() })
    const handleInvitationAccept = async (subjectNotification: Notification) => {
        const response = await NotificationApi.acceptInvitation(subjectNotification.id)
        if (response.error) {
            console.error('An error occured when accepting board invitation.')
            return
        }
        setNotifications(notifications.filter((notification) => notification.id !== subjectNotification.id))
        if (pathname === pathnames.boards) {
            window.location.reload()
        }
    }

    const handleLogOut = () => {
        deleteCookie('jwtToken', { secure: true, sameSite: 'strict' })
        removeUserId()
        router.push(GetPageUrl.login)
    }

    return (
        <div className={styles.layout}>
            <header>
                <Paper className={styles.navbar}>
                    <div className={styles.start_container}>
                        <Box className={styles.notification_button_wrapper}>
                            <Typography variant="h2">Worth Manager</Typography>
                        </Box>
                    </div>
                    <div className={styles.end_container}>
                        <Box className={styles.notification_button_wrapper}>
                            <NotificationDropdown
                                notifications={notifications}
                                isLoading={isLoading}
                                errorMsg={errorMsg}
                                onInvitationAccept={handleInvitationAccept}
                            />
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
                                        onClick: handleLogOut
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
