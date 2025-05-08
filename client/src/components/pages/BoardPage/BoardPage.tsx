'use client'

import { Alert, Box, Skeleton, Snackbar, Typography } from '@mui/material'

import styles from './BoardPage.module.scss'
import BoardView from '@/components/pages/BoardPage/BoardView'
import BoardApi from '@/api/board.api'
import { Board } from '../../../types/types'
import { Task } from '@/types/types'
import useFetch from '@/hooks/useFetch'
import { useState } from 'react'
import MessagePopupProvider from '@/components/shared/MessagePopup/MessagePopupProvider'

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
    } = useFetch({
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
        const tasksContainUpdated =  board.tasks.some(t => t.id === updatedTask.id)
        const updateExistingTask = board.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        
        const updatedTasks = tasksContainUpdated ? updateExistingTask : [...board.tasks, updatedTask]

        setBoard({
            ...board,
            tasks: updatedTasks
        })
    }

    const handleTaskDelete = (deletedTask: Task) => {
        setBoard({
            ...board,
            tasks: board.tasks.filter(task => task.id !== deletedTask.id)
        })
    }

    return (
        <MessagePopupProvider>
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
                        refetch={refetchBoard}
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
        </MessagePopupProvider>
    )
}

export default BoardPage
