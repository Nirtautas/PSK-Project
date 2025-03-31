'use client'

import styles from './RegisterPage.module.scss'
import { TextField, Typography, Button, Link, Box } from '@mui/material'
import PasswordInput from '@/components/templates/FormControlLayout/PasswordInput'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthApi from '@/api/auth.api'
import { setCookie } from 'cookies-next'
import { setUserId } from '@/utils/userId'

const RegisterPage = () => {
    const [errorMsg, setErrorMsg] = useState<string>('')
    const router = useRouter()

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        
        const { firstname, lastname, email, username, password } = event.target as HTMLFormElement
        const regResponse = await AuthApi.register({
            firstName: firstname.value,
            lastName: lastname.value,
            email: email.value,
            userName: username.value,
            password: password.value
        })
        if (regResponse.error) {
            setErrorMsg(regResponse.error)
            return
        }

        const response = await AuthApi.login({
            username: username.value,
            password: password.value
        })
        if (response.error) {
            setErrorMsg(response.error)
            return
        }
        const { jwtToken, id } = response.result!
        setCookie('jwtToken', jwtToken, { secure: true, sameSite: 'strict' })
        setUserId(id)
        // router.push(GetPageUrl.boards(0))
        router.push('/boards')
    }
    return (
        <div className={styles.content}>
            <Box component="section" sx={{
                p: 2,
                m: 4,
                border: '1px solid grey'}}>
                <form onSubmit={onSubmit} className={styles.login_box_container}>
                    <Typography variant="h3">Register</Typography>
                    <br />
                    <div className={styles.horizontal}>
                        <TextField name="firstname" label="First Name" variant="outlined" required/>
                        <TextField name="lastname" label="Last Name" variant="outlined" required/>
                    </div>
                    <TextField name="email" type="email" label="Email" variant="outlined" required/>
                    <TextField name="username" label="Username" variant="outlined" required/>
                    <PasswordInput name="password" required/>
                    <br />
                    {errorMsg}
                    <Button type="submit" variant="contained">Register</Button>
                    <br />
                    <div className={styles.horizontal} style={{
                        marginTop: 3
                    }}>
                        Already have an account?
                        <Link href="login">Login now</Link>
                    </div>
                </form>
            </Box>
        </div>
    )
}

export default RegisterPage