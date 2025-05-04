'use client'

import React, { useState } from 'react'
import AuthApi from '@/api/auth.api'
import { TextField, Typography, Button, Box, Alert } from '@mui/material'

import styles from '../LoginPage/LoginPage.module.scss'

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('')
    const [errorMsg, setErrorMsg] = useState<string>()
    const [successMsg, setSuccessMsg] = useState<string>()

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const response = await AuthApi.forgotPassword({ email: email })

        if (response.error) {
            setErrorMsg(response.error)
            setSuccessMsg(undefined)
            return
        }

        setSuccessMsg(response.result?.message)
        setErrorMsg(undefined)
    }

    return (
        <div className={styles.content}>
            <Box component="section" sx={{ p: 2, m: 4, border: '1px solid grey' }}>
                <form onSubmit={onSubmit} className={styles.login_box_container}>
                    <Typography variant="h4">Forgot Password</Typography>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Enter your email address to reset your password.
                    </Typography>

                    {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                    {successMsg && <Alert severity="success">{successMsg}</Alert>}

                    <TextField
                        name="email"
                        label="Email"
                        variant="outlined"
                        required
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button type="submit" variant="contained" fullWidth>
                        Reset
                    </Button>
                </form>
            </Box>
        </div>
    )
}

export default ForgotPasswordPage