import { Box, Card, CardActionArea, Modal, Typography } from '@mui/material'
import { Task } from '@/types/types'

import styles from './TaskCard.module.scss'
import React from 'react'
import TaskCardInfoPopup from './TaskCardInfoPopup'

type Props = {
    boardId: number,
    task: Task
    onClick: () => void
    onMouseDown: (e: MouseEvent, task: Task) => void
    onTaskUpdate: (t: Task) => void
}

const TaskCard = ({ boardId, onClick, task, onMouseDown, onTaskUpdate }: Props) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    return (
        <>
            <Card elevation={2} className={styles.task_card} onMouseDown={(e) => onMouseDown(e as unknown as MouseEvent, task)} onClick={handleOpen}>
                <CardActionArea
                    onClick={onClick}
                    sx={{
                        display: 'flex',
                        height: '100%'
                    }}
                >
                    <span>
                        {task.title}
                    </span>
                </CardActionArea>
            </Card>
            <TaskCardInfoPopup boardId={boardId} open={open} setOpen={setOpen} task={task} handleUpdate={onTaskUpdate}/>
        </>
    )
}

export default TaskCard
