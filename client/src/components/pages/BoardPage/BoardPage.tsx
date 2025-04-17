'use client'

import { Box, Skeleton, Typography } from '@mui/material'

import styles from './BoardPage.module.scss'
import BoardView from '@/components/pages/BoardPage/BoardView'
import useFetch from '@/hooks/useFetch'
import BoardApi from '@/api/board.api'
import { useState } from 'react'
import { Task } from '@/types/types'
import CollaboratorApi from '@/api/collaborator.api'

type Props = {
    boardId: number
}

const BoardPage = ({ boardId }: Props) => {
    const {
        data: board,
        errorMsg,
        isLoading,
        setData: setBoard
    } = useFetch({ resolver: () => BoardApi.getBoardById(boardId) })

    const handleTaskCreate = (task: Task) => { 
        setBoard({
            ...board,
            tasks: [...board.tasks, task]
        })
    }

    return (
        <div className={styles.content}>
            <Box className={styles.toolbar}>
                <Typography variant="h3">{ !isLoading ? board?.name || '' : <Skeleton sx={{ width: '10em' }} />}</Typography>
            </Box>
            <div className={styles.board_view_container}>
                <BoardView boardId={boardId} tasks={board?.tasks || []} errorMsg={errorMsg} isLoading={isLoading} onCreate={handleTaskCreate}/>
            </div>
        </div>
    )
}

export default BoardPage
