'use client'

import { Alert, Box, Skeleton, Snackbar, Typography } from '@mui/material'

import styles from './BoardPage.module.scss'
import BoardView from '@/components/pages/BoardPage/BoardView'
import BoardApi from '@/api/board.api'
import { Board } from '../../../types/types'
import { Task } from '@/types/types'
import useFetchResponse from '@/hooks/useFetchResponse'
import { useState } from 'react'

type Props = {
    boardId: number
}

const BoardPage = ({ boardId }: Props) => {
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')
    const {
        data: board,
        setData: setBoard,
        errorMsg: boardErrorMsg,
        isLoading: isBoardLoading,
        refetch: refetchBoard
    } = useFetchResponse({
        resolver: () => BoardApi.getBoardById(boardId)
    })

    const onUpdate = (updatedBoard: Board) => {
        setBoard({
            ...updatedBoard,
            tasks: board.tasks
        })
    }

    const handleTaskCreate = (task: Task) => {
        setBoard({
            ...board,
            tasks: [...board.tasks, task]
        })
    }

    const handleTaskUpdate = (updatedTask: Task) => {
        setBoard({
            ...board,
            tasks: board.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        })
    }

    const handleTaskDelete = (deletedTask: Task) => {
        setBoard({
            ...board,
            tasks: board.tasks.filter(task => task.id !== deletedTask.id)
        })
    }

    return (
        <div className={styles.content}>
            <Box className={styles.toolbar}>
                {isBoardLoading
                    ? <Skeleton variant="rectangular" sx={{ width: '100px', height: '100px' }} />
                    : <img src={board?.imageURL ?? undefined} alt="Board Image" className={styles.board_image} />}
                <Typography variant="h3" className={styles.board_title}>
                    {!isBoardLoading ? board.title || '' : <Skeleton sx={{ width: '10em' }} />}
                </Typography>
            </Box>
            <div className={styles.board_view_container}>
                <BoardView
                    boardId={boardId}
                    tasks={board?.tasks || []}
                    errorMsg={boardErrorMsg}
                    isLoading={isBoardLoading}
                    onCreate={handleTaskCreate}
                    onUpdate={onUpdate}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskDelete={handleTaskDelete}
                    onTaskVersionMismatch={() => {
                        setSnackbarMsg('Task version mismatch. Reloading the board.')
                        refetchBoard()
                    }}
                />
            </div>
            <Snackbar
                open={!!snackbarMsg}
                autoHideDuration={4000}
                onClose={() => setSnackbarMsg('')}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            >
                <Alert
                    onClose={() => setSnackbarMsg('')}
                    severity="warning"
                    elevation={6}
                    variant="filled"
                    sx={{ width: '100%', fontSize: '1rem' }}
                >
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default BoardPage
