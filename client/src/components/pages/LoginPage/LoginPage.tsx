'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthApi from '@/api/auth.api'
import { GetPageUrl } from '@/constants/route'
import { setCookie } from 'cookies-next/client'
import { setUserId } from '@/utils/userId'
import { TextField, Typography, Button, Link, Box } from '@mui/material'
import PasswordInput from '@/components/templates/FormControlLayout/PasswordInput'

import styles from './LoginPage.module.scss'

const LoginPage = () => {
    const [errorMsg, setErrorMsg] = useState<string>()
    const router = useRouter()

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const { username, password } = event.target as HTMLFormElement
        const response = await AuthApi.login({
            username: username.value,
            password: password.value
        })
        if (response.error) {
            setErrorMsg(response.error)
            console.log(errorMsg)
            return
        }
        const { jwtToken, id } = response.result!
        setCookie('jwtToken', jwtToken, { secure: true, sameSite: 'strict' })
        setUserId(id)
        router.push(GetPageUrl.boards(0))
    }

    return (
        <div className={styles.content}>
            <Box component="section" sx={{
                p: 2,
                m: 4,
                border: '1px solid grey'}}>
                <form onSubmit={onSubmit} className={styles.login_box_container}>
                    <Typography variant="h3">Login</Typography>
                    <TextField
                        name="username"
                        label="Username"
                        variant="outlined"
                        required
                        error={errorMsg === "Unauthorized"} 
                        helperText={errorMsg === "Unauthorized" ? "Invalid credentials" : ""}/>
                    <PasswordInput
                        name="password"
                        error={errorMsg === "Unauthorized"}
                        required />
                    <Link href="/forgot-password">Forgot password</Link>
                    <br />
                    <Button type="submit" variant="contained">Login</Button>
                    <div className={styles.horizontal}>
                        Don't have an account?
                        <Link href="/register">Register now</Link>
                    </div>
                </form>
            </Box>
        </div>
    )
}

export default LoginPage