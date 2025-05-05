'use client'

import { Alert, Button, Modal, Paper, Stack, TextField, Typography } from '@mui/material'

import styles from './BoardManagemenModal.module.scss'
import { useEffect, useState } from 'react'
import { placeholderImageUrl } from '@/constants/placeholders'
import { CreateBoardDto } from '../../../../api/board.api'

type Props = {
    open: boolean
    onClose: () => void
    onSubmit: (args: CreateBoardDto) => void
    initialData?: CreateBoardDto
    mode: 'create' | 'edit'
}

const BoardManagementModal = ({ open, onClose, onSubmit, initialData, mode }: Props) => {
    const [title, setTitle] = useState(initialData?.title || '')
    const [titleError, setTitleError] = useState<string>('')
    const [description, setDescription] = useState(initialData?.description || '')
    const [imageURL, setImageURL] = useState<string | null>(initialData?.imageURL ?? '')

    //const [image, setImage] = useState<File | null>(null)
    //const imageUrl = (image && URL.createObjectURL(image as Blob)) || placeholderImageUrl

    //const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    //    if (event.target.files && event.target.files.length > 0) {
    //        setImage(event.target.files[0])
    //    }
    //}

    useEffect(() => {
        setTitleError('')

        if (initialData) {
            setTitle(initialData.title)
            setDescription(initialData.description)
            setImageURL(initialData.imageURL)
        }
    }, [initialData, open])

    const handleSubmit = () => {
        if (!title.trim()) {
            setTitleError('Board title is required.')
            return
        } 

        onSubmit({ title, description, imageURL: imageURL?.trim() || placeholderImageUrl })
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
                        <TextField
                            label="Image URL"
                            variant="outlined"
                            fullWidth
                            value={imageURL ?? ''}
                            onChange={(e) => setImageURL(e.target.value)}
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

/*
<div className={styles.image_section}>
    <div className={styles.upload}>
        <img src={imageUrl} alt="img"/>
        <Button variant="contained" component="label" sx={{ margin: 'auto 0 auto auto' }}>
            Upload Image
            <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
        </Button>
    </div>
    {image && <p>{image.name}</p>}
</div>
*/


export default BoardManagementModal
