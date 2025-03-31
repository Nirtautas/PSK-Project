'use client'

import styles from './RegisterPage.module.scss'
import { TextField, Typography, Button, Link, Box } from '@mui/material'
import PasswordInput from '@/components/templates/FormControlLayout/PasswordInput'

const RegisterPage = () => {
    return (
        <div className={styles.content}>
            <Box component="section" sx={{
                p: 2,
                m: 4,
                border: '1px solid grey'}}>
                <div className={styles.login_box_container}>
                    <Typography variant="h3">Register</Typography>
                    <br />
                    <div className={styles.horizontal}>
                        <TextField id="outlined-basic" label="First Name" variant="outlined" required/>
                        <TextField id="outlined-basic" label="Last Name" variant="outlined" required/>
                    </div>
                    <TextField id="outlined-basic" label="Username" variant="outlined" required/>
                    <TextField id="outlined-basic" type="email" label="Email" variant="outlined" required/>
                    <PasswordInput required/>
                    <br />
                    <Button variant="contained">Register</Button>
                    <br />
                    <div className={styles.horizontal} style={{
                        marginTop: 3
                    }}>
                        Already have an account?
                        <Link href="login">Login now</Link>
                    </div>
                </div>
            </Box>
        </div>
    )
}

export default RegisterPage