'use client'

import { Box, Skeleton, Typography } from '@mui/material'

import styles from './BoardPage.module.scss'
import BoardView from '@/components/pages/BoardPage/BoardView'
import useFetch from '@/hooks/useFetch'
import BoardApi from '@/api/board.api'
import { Board } from '../../../types/types'
import { FetchResponse } from '../../../types/fetch'
import { Task } from '@/types/types'

type Props = {
    boardId: number
}

const BoardPage = ({ boardId }: Props) => {
    const {
        data,
        setData,
        errorMsg,
        isLoading
    } = useFetch({
        resolver: () => BoardApi.getBoardById(boardId), delayMs: 1000
    })

    const onUpdate = (updatedBoard: FetchResponse<Board>) => {
        setData(updatedBoard)
    }

    const handleTaskCreate = (task: Task) => { 
        if (!data?.result) return

        setData({
            ...data,
            result: {
                ...data.result,
                tasks: [...data.result.tasks, task]
            }
        })
    }

    const handleTaskUpdate = (updatedTask: Task) => {
        if (!data?.result) return

        setData({
            ...data,
            result: {
                ...data.result,
                tasks: data.result.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
            }
        })
    }

    return (
        <div className={styles.content}>
            <Box className={styles.toolbar}>
                <img src={data?.result?.imageURL ?? undefined} alt="Board Image" className={styles.board_image} />
                <Typography variant="h3" className={styles.board_title}>
                    {!isLoading ? data?.result?.title || '' : <Skeleton sx={{ width: '10em' }} />}
                </Typography>
            </Box>
            <div className={styles.board_view_container}>
                <BoardView
                    boardId={boardId}
                    tasks={data?.result?.tasks || []}
                    errorMsg={errorMsg}
                    isLoading={isLoading}
                    onCreate={handleTaskCreate}
                    onUpdate={onUpdate}
                    onTaskUpdate={handleTaskUpdate} />
            </div>
        </div>
    )
}

export default BoardPage
