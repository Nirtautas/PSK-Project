'use client'

import { Box, Paper, Typography, TextField, Button, Alert, Stack } from "@mui/material"
import { useState } from "react"
import AuthApi from "../../../../api/auth.api"

import styles from '../ProfilePage.module.scss';
import { useRouter, useSearchParams } from "next/navigation";
import { GetPageUrl } from "../../../../constants/route";
import PasswordInput from "../../../templates/FormControlLayout/PasswordInput";

const ChangePasswordPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const email = searchParams.get('email') ?? '';

    const [oldPassword, setOldPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [repeatNewPassword, setRepeatNewPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>()
    const [successMessage, setSuccessMessage] = useState<string>()

    const handleResetPassword = async () => {
        setSuccessMessage(undefined)
        setErrorMessage(undefined)

        if (!oldPassword || !newPassword || !repeatNewPassword) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (newPassword != repeatNewPassword)
        {
            setErrorMessage("New passwords do not match!");
            return;
        }

        setIsLoading(true)

        const response = await AuthApi.changePassword({ email, oldPassword, newPassword })
        if (!response.result)
        {
            setErrorMessage(response.error ?? "Unexpected error!");
            setIsLoading(false)
            return;
        }

        setSuccessMessage(response.result?.message)
        setIsLoading(false)
    };

    return (
        <Box sx={{ p: 4, maxWidth: 800 }}>
            <Box className={styles.toolbar}>
                <Typography variant="h3">
                    Change Password:
                </Typography>
                <Button variant="contained" onClick={() => router.push(GetPageUrl.users)}>Cancel</Button>
            </Box>

            <Paper elevation={3} sx={{ maxWidth: 600, p: 3 }}>
                <Stack spacing={2}>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}

                    <PasswordInput
                        label="Old Password"
                        name="password"
                        required
                        onChange={(e) => setOldPassword(e.target.value)} />

                    <PasswordInput
                        label="New Password"
                        name="password"
                        required
                        onChange={(e) => setNewPassword(e.target.value)} />

                    <PasswordInput
                        label="Repeat New Password"
                        name="password"
                        required
                        onChange={(e) => setRepeatNewPassword(e.target.value)} />

                    <Button variant="contained" onClick={handleResetPassword} disabled={isLoading}>
                        {isLoading ? "Changing..." : "Change Password"}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default ChangePasswordPage;