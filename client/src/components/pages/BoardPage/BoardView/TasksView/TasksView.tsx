
import { Paper, Typography } from '@mui/material'

import styles from './TasksView.module.scss'
import TaskList from '@/components/pages/BoardPage/BoardView/TasksView/TaskList'
import { Task } from '@/types/types'

const TasksView = () => {
    const columns: { label: string, items: Task[] }[] = [
        {
            label: 'Waiting',
            items: [
                {
                    id: 123,
                    title: 'Task 1',
                },
                {
                    id: 123,
                    title: 'Task 1',
                },
                {
                    id: 123,
                    title: 'Task 1',
                },
                {
                    id: 123,
                    title: 'Task 1',
                },
                // {
                //     id: 123,
                //     title: 'Task 1',
                // },
                // {
                //     id: 123,
                //     title: 'Task 1',
                // }
            ]
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
                        <TaskList isLoading={false} tasks={column.items} />
                    </div>
                ))
            }
        </Paper>
    )
}

export default TasksView
