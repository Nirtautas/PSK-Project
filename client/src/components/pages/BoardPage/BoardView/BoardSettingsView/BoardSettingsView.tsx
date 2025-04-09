'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BoardApi from '@/api/board.api'
import { Typography, Button, Box } from '@mui/material'
import styles from './BoardSettingsView.module.scss'

type Props = {
    boardId: number
    isLoading: boolean
    errorMsg: string
}

const BoardSettingsView = ({ boardId, isLoading, errorMsg }: Props) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string>('')
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this board?'))
            return

        try {
            setIsDeleting(true)
            await BoardApi.deleteBoard(boardId)
            router.push('/boards')
        } catch (err: any) {
            setDeleteError(err?.message || 'Failed to delete board.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="board-settings">
            <Typography variant="h5">Board Settings</Typography>

            {errorMsg && <Typography color="error">{errorMsg}</Typography>}
            {deleteError && <Typography color="error">{deleteError}</Typography>}

            <Box className={styles.warning_box}>
                <Typography variant="body2" className={styles.delete_warning_text}>
                    Selecting this option will delete the board including tasks, linked users, and comments!
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                    disabled={isDeleting || isLoading}
                    className={styles.delete_button}
                >
                    {isDeleting ? 'Deleting...' : 'Delete Board'}
                </Button>
            </Box>
        </div>
    )
}

export default BoardSettingsView