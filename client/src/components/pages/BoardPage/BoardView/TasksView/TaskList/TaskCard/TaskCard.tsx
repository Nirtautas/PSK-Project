import { Card, CardActionArea } from '@mui/material'
import { Task } from '@/types/types'

import styles from './TaskCard.module.scss'

type Props = {
    task: Task
    onClick: () => void
}

const TaskCard = ({ onClick, task }: Props) => {
    return (
        <Card elevation={2} className={styles.task_card}>
            <CardActionArea
                onClick={onClick}
                sx={{
                    display: 'flex',
                    height: '100%'
                }}
            >
                {task.title}
            </CardActionArea>
        </Card>
    )
}

export default TaskCard
