
import styles from './TaskList.module.scss'
import { Skeleton } from '@mui/material'
import { Role, Task } from '@/types/types'
import TaskCard from '@/components/pages/BoardPage/BoardView/TasksView/TaskList/TaskCard'
import ErrorDisplay from '@/components/shared/ErrorDisplay'
import { FetchResponse } from '@/types/fetch'

type Props = {
    boardId: number,
    id: string
    isLoading: boolean
    errorMsg: string
    tasks: Task[]
    onMouseDown: (e: MouseEvent, task: Task) => void
    onTaskUpdate: (t: Task) => void
    userRole: FetchResponse<Role | null>
}

const TaskList = ({ boardId, isLoading, tasks, errorMsg, onMouseDown, onTaskUpdate, userRole }: Props) => {
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

    return (
        <div className={styles.tasks_list}>
                {tasks.map((task, index) => (
                    <div key={index} className={styles.task_card_wrapper}>
                        <TaskCard
                            boardId={boardId}
                            task={task}
                            onClick={() => { console.log('clicked task: ', task)}}
                            onMouseDown={onMouseDown}
                            onTaskUpdate={onTaskUpdate}
                            userRole={userRole}/>
                    </div>
                ))}
        </div>
    )
}

export default TaskList
