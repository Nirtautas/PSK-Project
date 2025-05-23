'use client'

import { Box, Button, MenuItem, Paper, Skeleton, Typography } from '@mui/material'

import styles from './NavBarLayout.module.scss'
import UserProfile from '@/components/templates/NavBarLayout/UserProfile'
import { usePathname, useRouter } from 'next/navigation'
import { getPageUrl, pathnames } from '@/constants/urls'
import NotificationApi from '@/api/notification.api'
import { Notification, User } from '@/types/types'
import { getUserId, removeUserId } from '@/utils/userId'
import { deleteCookie } from 'cookies-next'
import { GetPageUrl } from '@/constants/route'
import useFetch from '@/hooks/useFetch'
import NotificationDropdown from '@/components/templates/NavBarLayout/NotificationDropdown'
import UserApi from '@/api/user.api'
import { useEffect, useState } from 'react'
import React from 'react'

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
    } = useFetch({ resolver: () => NotificationApi.getAll() })

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

    const handleInvitationDecline = async (subjectNotification: Notification) => {
        const confirmMsg = `Notification will be deleted. Are you sure?`
        if (!confirm(confirmMsg))
            return

        const response = await NotificationApi.declineInvitation(subjectNotification.id)
        if (response.error) {
            console.error('An error occured when accepting board invitation.')
            return
        }
        setNotifications(notifications.filter((notification) => notification.id !== subjectNotification.id))
    }


    const handleNotificationsDelete = async () => {
        const response = await NotificationApi.deleteAll()
        if (response.error) {
            console.error('An error occurred when deleting all notifications.')
            return
        }
        setNotifications([])
    }

    const handleLogOut = () => {
        deleteCookie('jwtToken', { secure: true, sameSite: 'strict' })
        removeUserId()
        router.push(GetPageUrl.login)
    }

    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
    const fetchUser = async () => {
        const response = await UserApi.getById(getUserId());
        if (response.result) setUser(response.result);
    };

    fetchUser();

    const handleUserUpdated = () => {
        fetchUser();
    };

    window.addEventListener('userUpdated', handleUserUpdated);
    return () => window.removeEventListener('userUpdated', handleUserUpdated);
    }, []);

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
                                onInvitationDecline={handleInvitationDecline}
                                onDeleteAllNotifications={handleNotificationsDelete}
                            />
                        </Box>
                        <Box className={styles.centered_wrapper}>
                            {user && <UserProfile
                                name={user.userName ?? "name"}
                                imageUrl={user.imageURL || undefined}
                                buttons={[
                                    {
                                        label: 'My Boards',
                                        onClick: () => {
                                            router.push(GetPageUrl.boards(0))
                                        }
                                    },
                                    {
                                        label: 'Profile',
                                        onClick: () => {
                                            router.push(getPageUrl.profile())
                                        }
                                    },
                                    {
                                        label: 'Log out',
                                        onClick: handleLogOut
                                    },
                                ]}
                            />}
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