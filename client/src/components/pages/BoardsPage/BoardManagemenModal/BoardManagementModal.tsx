'use client'

import { Alert, Button, Modal, Paper, Stack, TextField, Typography } from '@mui/material'

import React, { useEffect, useMemo, useState } from 'react'
import { placeholderImageUrl } from '@/constants/placeholders'
import { CreateBoardDto } from '../../../../api/board.api'
import FileUpload from '@/components/shared/FileUpload/'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'

import styles from './BoardManagemenModal.module.scss'

export type CreateBoardFormArgs = {
    title: string
    description: string
    image: File | null
}

type Props = {
    open: boolean
    onClose: () => void
    onSubmit: (args: CreateBoardFormArgs) => void
    initialData?: CreateBoardDto
    mode: 'create' | 'edit'
}

const BoardManagementModal = ({ open, onClose, onSubmit, initialData, mode }: Props) => {
    const [title, setTitle] = useState(initialData?.title || '')
    const [titleError, setTitleError] = useState<string>('')
    const [description, setDescription] = useState(initialData?.description || '')

    const [image, setImage] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState(initialData?.imageName || (image && URL.createObjectURL(image)))
    
    const handleImageUpload = (image: File) => {
        setImage(image)
        setImageUrl(image && URL.createObjectURL(image))
    }

    useEffect(() => {
        setTitleError('')
        if (initialData) {
            setTitle(initialData.title)
            setDescription(initialData.description)
            setImageUrl(initialData?.imageName)
        }
    }, [initialData])

    const handleSubmit = () => {
        if (!title.trim()) {
            setTitleError('Board title is required.')
            return
        }

        const safeDescription = description.trim() || ''

        onSubmit({ title, description: safeDescription, image: image })
        setTitle('')
        setDescription('')
        setImage(null)
        setImageUrl('')
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div className={styles.wrapper}>
                <Paper className={styles.container}>
                    <Typography variant="h3" className={styles.title_text}>{mode === 'edit' ? 'Edit Board' : 'Create New Board'}</Typography>

                    <Stack spacing={2} sx={{ maxWidth: 400 }} className={styles.form}>
                        {titleError && <Alert severity="error">{titleError}</Alert>}
                        <TextField
                            label="Board Title"
                            variant="outlined"
                            required
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            multiline
                            rows={3}
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <FileUpload
                            image={image}
                            imageUrl={imageUrl || ''}
                            onUpload={handleImageUpload}
                        />
                    </Stack>
                    <div className={styles.buttons}>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit} className={styles.buttons_button_right} sx={{ marginLeft: '1rem' }}>
                            {mode === 'edit' ? 'Edit' : 'Create'}
                        </Button>
                    </div>
                </Paper>
            </div>
        </Modal>
    )
}

export default BoardManagementModal
