import { Box, Paper, Typography } from "@mui/material"
import styles from './ArchivedTasksView.module.scss'
import { Role, Task, TaskStatus } from "@/types/types"
import TaskCard from "../TasksView/TaskList/TaskCard"
import BoardOnUserApi from "@/api/boardOnUser.api"
import { getUserId, setUserId } from "@/utils/userId"
import { useEffect, useState } from "react"
import useFetch from '@/hooks/useFetch'

type Props = {
    boardId: number,
    tasks: Task[],
    onTaskUpdate: (t: Task) => void,
    onTaskDelete: (t: Task) => void
}

const ArchivedTasksView = ({ boardId, tasks, onTaskUpdate, onTaskDelete }: Props) => {
    const [userId, setUserId] = useState<number | null>(null)
    
    useEffect(() => {
        const userId = getUserId()
        setUserId(userId)
    }, [])
    
    const userRole = useFetch({ resolver: () => BoardOnUserApi.getUserRole(boardId, userId), deps: [userId] })

    console.log(tasks.map(task => task.title))
    return (
        <div className={styles.container}>
            <Box>
                <Typography variant="h5">Archived Tasks</Typography>
            </Box>
            <Paper className={styles.tasks_container}>
                <div className={styles.task_list}>
                    {userRole && userRole.data && tasks.map((task, index) => (
                        task.taskStatus == TaskStatus.ARCHIVED
                        &&
                        <div key={index} className={styles.task_card_wrapper}>
                            <TaskCard
                                boardId={boardId}
                                task={task}
                                onClick={() => { console.log('clicked task: ', task)}}
                                onTaskUpdate={onTaskUpdate}
                                userRole={userRole.userRole}
                                onDelete={onTaskDelete}/>
                        </div>
                    ))}
                </div>
            </Paper>
        </div>
    )
}

export default ArchivedTasksView
