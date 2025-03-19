
import styles from './TaskList.module.scss'
import { Skeleton } from '@mui/material'
import { Task } from '@/types/types'
import TaskCard from '@/components/pages/BoardPage/BoardView/TasksView/TaskList/TaskCard'

type Props = {
    isLoading: boolean
    tasks: Task[]
}

const TaskList = ({ isLoading, tasks }: Props) => {
    if (isLoading) {
        return (
            <div className={styles.tasks_list}>
                <Skeleton variant="rounded" sx={{ display: 'flex', flex: 1 }} />
            </div>
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
