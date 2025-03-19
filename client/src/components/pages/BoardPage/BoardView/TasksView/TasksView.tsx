
import { Button, Paper, Typography } from '@mui/material'

import styles from './TasksView.module.scss'

const TasksView = () => {
    const columns = [
        {
            label: 'Waiting',
            items: []
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
                            <Typography variant="h6" className={styles.label}>Waiting</Typography>
                        </div>
                    </div>
                ))
            }
        </Paper>
    )
}

export default TasksView
