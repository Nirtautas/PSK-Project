'use client'

import styles from './GuestNavBarLayout.module.scss'
import { Paper, Typography, Box, Button } from '@mui/material'

type Props = {
    children: React.ReactNode
}

const GuestNavBarLayout = ({ children }: Props) => {
    return (
        <div className={styles.layout}>
            <header>
                <Paper className={styles.navbar}>
                    <div className={styles.start_container}>
                        <Box className={styles.centered_wrapper}>
                            <Typography variant="h2">Worth Manager</Typography>
                        </Box>
                    </div>
                    <div className={styles.end_container}>
                        <Box className={styles.centered_wrapper}>
                            <Button variant="outlined" href="/login">Login</Button>
                            <Button variant="outlined" href="/register">Register</Button>
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

export default GuestNavBarLayout