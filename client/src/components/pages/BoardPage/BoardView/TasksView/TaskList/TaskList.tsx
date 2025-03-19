
import styles from './TaskList.module.scss'
import { Paper, Skeleton } from '@mui/material'
import { Task } from '@/types/types'
import TaskCard from '@/components/pages/BoardPage/BoardView/TasksView/TaskList/TaskCard'
import ErrorDisplay from '@/components/shared/ErrorDisplay'

type Props = {
    isLoading: boolean
    errorMsg: string
    tasks: Task[]
}

const TaskList = ({ isLoading, tasks, errorMsg }: Props) => {
    if (isLoading) {
        return (
            <div className={styles.tasks_list}>
                <Skeleton variant="rounded" sx={{ display: 'flex', flex: 1, height: '100%' }} />
            </div>
        )
    }
    if (errorMsg) {
        return (
            <ErrorDisplay msg={errorMsg} />
        )
    }

    const handleClick = () => {

    }

    return (
        <div className={styles.tasks_list}>
                {tasks.map((task, index) => (
                    <div key={index} className={styles.task_card_wrapper}>
                        <TaskCard task={task} onClick={handleClick} />
                    </div>
                ))}
        </div>
    )
}

export default TaskList
