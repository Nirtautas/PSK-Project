import { Card, CardActionArea } from '@mui/material'
import { Task } from '@/types/types'

import styles from './TaskCard.module.scss'
import { MouseEventHandler } from 'react'

type Props = {
    task: Task
    onClick: () => void
    onMouseDown: (task: Task, e: MouseEvent) => void
}

const TaskCard = ({ onClick, task, onMouseDown }: Props) => {
    return (
        <Card elevation={2} className={styles.task_card} onMouseDown={(e) => onMouseDown(task, e as unknown as MouseEvent)} onClick={onClick}>
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
    )
}

export default TaskCard
