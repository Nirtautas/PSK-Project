
import { Paper, Typography } from '@mui/material'

import styles from './TasksView.module.scss'
import TaskList from '@/components/pages/BoardPage/BoardView/TasksView/TaskList'
import { Task } from '@/types/types'

type Props = {
    tasks: Task[]
    isLoading: boolean
    errorMsg: string
}

const TasksView = ({ tasks, isLoading, errorMsg }: Props) => {
    const columns: { label: string, items: Task[] }[] = [
        {
            label: 'Waiting',
            items: tasks
        },
        {
            label: 'In Progress',
            items: []
        },
        {
            label: 'Done',
            items: []
        }
    ]

    return (
        <Paper className={styles.container}>
            {
                columns.map((column, index) => (
                    <div className={styles.tasks_list} key={index}>
                        <div className={styles.label_wrapper}>
                            <Typography variant="h6" className={styles.label}>{column.label}</Typography>
                        </div>
                        <TaskList isLoading={isLoading} tasks={column.items} errorMsg={errorMsg} />
                    </div>
                ))
            }
        </Paper>
    )
}

export default TasksView
