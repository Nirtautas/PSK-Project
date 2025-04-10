import { Box, Card, CardActionArea, Modal, Typography } from '@mui/material'
import { Task } from '@/types/types'

import styles from './TaskCard.module.scss'
import React from 'react'
import TaskCardInfoPopup from './TaskCardInfoPopup'

type Props = {
    task: Task
    onClick: () => void
    onMouseDown: (e: MouseEvent, task: Task) => void
}

const TaskCard = ({ onClick, task, onMouseDown }: Props) => {

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
            <TaskCardInfoPopup open={open} setOpen={setOpen} task={task}/>
        </>
    )
}

export default TaskCard
