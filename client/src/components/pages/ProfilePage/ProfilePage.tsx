import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Avatar, Grid, TextField, Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import styles from './ProfilePage.module.scss'
import UserApi from '@/api/user.api'
import { getUserId } from '@/utils/userId'
import { User } from '@/types/types'
import { useRouter } from 'next/navigation'
import { GetPageUrl } from '../../../constants/route'
import UploadApi from '@/api/upload.api'
import FileUpload from '@/components/shared/FileUpload'
import ImageIcon from '@mui/icons-material/Image'
import PersonIcon from '@mui/icons-material/Person'
import { useMessagePopup } from '@/components/shared/MessagePopup/MessagePopupProvider'

export type UserUpdateRequest = Omit<User, 'id' | 'creationDate'>

const ProfilePage = () => {
    const userId = getUserId()
    const router = useRouter()

    const [isEditMode, setIsEditMode] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userName, setUserName] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [joinedDate, setJoinedDate] = useState<string>('')
    const imageUrl = image && URL.createObjectURL(image) || ''
    const [originalUser, setOriginalUser] = useState<User | null>(null)

    const handleImageUpload = (image: File) => {
        setImage(image)
    }

    const messages = useMessagePopup()

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return

            const response = await UserApi.getById(Number(userId))
            if (response.result) {
                const user = response.result
                setOriginalUser(user)
                setFirstName(user.firstName)
                setLastName(user.lastName)
                setUserName(user.userName)
                setEmail(user.email)
                setImageURL(user.imageURL)
                const isoDate = new Date(user.creationDate).toISOString().split('T')[0]
                setJoinedDate(isoDate)
            } else {
                messages.displayError('Failed to fetch user data: ' + response.error)
            }
        }

        fetchUserData()
    }, [userId])

    const buildUserUpdateRequest = (): UserUpdateRequest => ({
        firstName,
        lastName,
        userName,
        email,
        imageURL,
    })

    const handleSaveChanges = async () => {
        let imageName = imageURL
        if (image) {
            const imageResponse = await UploadApi.uploadImage(image)
            if (!imageResponse.result) {
                messages.displayError(imageResponse.error || 'An error occurred')
                return
            }
            imageName = imageResponse.result
        }

        const updatedUserDto: UserUpdateRequest = {
            firstName,
            lastName,
            userName,
            email,
            imageURL: imageName,
        }

        const response = await UserApi.updateUser(Number(userId), updatedUserDto)
        if (response.result) {
            setIsEditMode(false)
            setImage(null)
            setImageURL(imageName)
            window.dispatchEvent(new Event('userUpdated'))

        } else {
            messages.displayError('Failed to update user: ' + response.error)
        }
    }

    return (
        <Box sx={{ p: 4, maxWidth: 800 }}>
            <Box className={styles.toolbar}>
                <Typography variant="h3">
                    {isEditMode ? "Edit Profile:" : "My Profile:"}
                </Typography>
                {isEditMode ? (
                    <>
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            gap={1}
                            mt={2}
                            sx={{ ml: 'auto' }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                                sx={{ width: '100px', height: '36px' }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setIsEditMode(false)
                                    setImage(null)

                                    if (originalUser) {
                                        setFirstName(originalUser.firstName)
                                        setLastName(originalUser.lastName)
                                        setUserName(originalUser.userName)
                                        setEmail(originalUser.email)
                                        setImageURL(originalUser.imageURL)
                                    }
                                }}
                                sx={{ width: '100px', height: '36px' }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditMode(true)}>
                        Edit Profile
                    </Button>
                )}
            </Box>

            <Paper elevation={3} sx={{ maxWidth: 600, p: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Avatar
                                    alt={userName}
                                    src={imageURL ? (imageURL.startsWith('http') ? imageURL : `http://localhost:5000/images/${imageURL}`) : undefined}
                                    sx={{ width: 56, height: 56 }}
                                >
                                    {!imageURL && <PersonIcon sx={{ fontSize: 40, color: 'white' }} />}
                                </Avatar>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6">{firstName} {lastName}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Joined since {joinedDate}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item className={styles.line}></Grid>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                fullWidth
                                InputProps={{ readOnly: !isEditMode }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                fullWidth
                                InputProps={{ readOnly: !isEditMode }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                fullWidth
                                InputProps={{ readOnly: !isEditMode }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                InputProps={{ readOnly: !isEditMode }}
                            />
                        </Grid>

                        {isEditMode && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="Uploaded"
                                            style={{
                                                width: 64,
                                                height: 64,
                                                objectFit: 'cover',
                                                borderRadius: 8,
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                backgroundColor: '#e0e0e0',
                                                borderRadius: 1,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <ImageIcon sx={{ color: '#9e9e9e', fontSize: 32 }} />
                                        </Box>
                                    )}

                                    <label htmlFor="upload-input">
                                        <input
                                            id="upload-input"
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    handleImageUpload(e.target.files[0])
                                                }
                                            }}
                                        />
                                        <Button variant="contained" component="span">
                                            Upload Image
                                        </Button>
                                    </label>
                                </Box>
                            </Grid>
                        )}

                        {!isEditMode && (
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" onClick={() => router.push(GetPageUrl.changePassword(email))}>
                                    Change Password
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Paper>
        </Box>
    )
}

export default ProfilePage