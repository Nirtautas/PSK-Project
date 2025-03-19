'use client'

import { Button, Modal, Paper, Stack, TextField, Typography } from '@mui/material'

import styles from './BoardManagemenModal.module.scss'
import { useState } from 'react'
import { placeholderImageUrl } from '@/constants/placeholders'

type Props = {
    open: boolean
    onClose: () => void
    onSubmit: (args: CreateBoardArgs) => void
}

export type CreateBoardArgs = {
    boardName: string,
    description: string,
    image: File | null
}

const BoardManagementModal = ({ open, onClose, onSubmit }: Props) => {
    const [boardName, setBoardName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const imageUrl = (image && URL.createObjectURL(image as Blob)) || placeholderImageUrl

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files[0])
        }
    }

    const handleSubmit = () => {
        onSubmit({ boardName, description, image })
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div className={styles.wrapper}>
                <Paper className={styles.container}>
                    <Typography variant="h3" className={styles.title_text}>Create New Board</Typography>

                    <Stack spacing={2} sx={{ maxWidth: 400 }} className={styles.form}>
                        <TextField
                            label="Board Name"
                            variant="outlined"
                            fullWidth
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
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
                    </Stack>

                    <div className={styles.buttons}>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit} className={styles.buttons_button_right} sx={{ marginLeft: '1rem' }}>
                            Create
                        </Button>
                    </div>
                </Paper>
            </div>
        </Modal>
    )
}

export default BoardManagementModal
