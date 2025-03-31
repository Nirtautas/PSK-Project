'use client'

import styles from './LoginPage.module.scss'
import { TextField, Typography, Button, Link, Box } from '@mui/material'
import PasswordInput from '@/components/templates/FormControlLayout/PasswordInput'

const LoginPage = () => {
    return (
        <div className={styles.content}>
            <Box component="section" sx={{
                p: 2,
                m: 4,
                border: '1px solid grey'}}>
                <div className={styles.login_box_container}>
                    <Typography variant="h3">Login</Typography>
                    <br />
                    <TextField id="outlined-basic" label="Username" variant="outlined" required/>
                    <PasswordInput required />
                    <Link href="#">forgot password</Link>
                    <br />
                    <Button variant="contained">Login</Button>
                    <div className={styles.horizontal}>
                        Don't have an account?
                        <Link href="register">Register now</Link>
                    </div>
                </div>
            </Box>
        </div>
    )
}

export default LoginPage