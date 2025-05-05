'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AuthApi from '@/api/auth.api'
import { TextField, Typography, Button, Box, Alert } from '@mui/material'
import PasswordInput from '@/components/templates/FormControlLayout/PasswordInput'

import styles from '../LoginPage/LoginPage.module.scss'

const ResetPasswordPage = () => {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const resetCode = searchParams.get('token')

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState<string>()
    const [successMsg, setSuccessMsg] = useState<string>()

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!email || !resetCode) {
            setErrorMsg('Missing reset token or email.')
            return
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg("Passwords do not match.")
            return
        }

        const response = await AuthApi.resetPassword({
            email,
            resetCode,
            newPassword
        })

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
                    <Typography variant="h4">Reset Password</Typography>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Enter your new password below.
                    </Typography>

                    {(errorMsg || successMsg) && (
                        <Box sx={{ mb: 2 }}>
                            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                            {successMsg && <Alert severity="success">{successMsg}</Alert>}
                        </Box>
                    )}

                    <PasswordInput
                        label="New Password"
                        name="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <PasswordInput
                        label="Confirm New Password"
                        name="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Set New Password
                    </Button>
                </form>
            </Box>
        </div>
    )
}

export default ResetPasswordPage