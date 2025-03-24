import { Card, CardActionArea } from '@mui/material'
import { Task } from '@/types/types'

import styles from './TaskCard.module.scss'

type Props = {
    task: Task
    onClick: () => void
    onMouseDown: (e: MouseEvent, task: Task) => void
}

const TaskCard = ({ onClick, task, onMouseDown }: Props) => {
    return (
        <Card elevation={2} className={styles.task_card} onMouseDown={(e) => onMouseDown(e as unknown as MouseEvent, task)} onClick={onClick}>
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
