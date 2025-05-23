import { Box, Button, Paper, Typography } from "@mui/material"
import styles from './ArchivedTasksView.module.scss'
import { Role, Task, TaskStatus } from "@/types/types"
import TaskCard from "../TasksView/TaskList/TaskCard"
import BoardOnUserApi from "@/api/boardOnUser.api"
import { getUserId, setUserId } from "@/utils/userId"
import { useEffect, useState } from "react"
import useFetch from '@/hooks/useFetch'
import TaskApi from "@/api/task.api"

type Props = {
    boardId: number,
    onTaskUpdate: (t: Task) => void
}

const ArchivedTasksView = ({ boardId, onTaskUpdate }: Props) => {
    const [userId, setUserId] = useState<number | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    
    useEffect(() => {
        const userId = getUserId()
        setUserId(userId!)
    }, [])
    
    const userRole = useFetch({ resolver: () => BoardOnUserApi.getUserRole(boardId, userId), deps: [userId] })

    const {
        isLoading: isLoading,
        data: fetchedTasks,
        setData: setFetchedTasks
    } = useFetch({ resolver: () => TaskApi.getArchivedTasks(boardId)})
    
    useEffect(() => {
        if (fetchedTasks) {
            setTasks(fetchedTasks)
        }
    }, [fetchedTasks])

    const handleUpdate = (updatedTask: Task) => {
        const updatedTasks = tasks.map(task => task.id !== updatedTask.id ? task : updatedTask)
        setTasks(updatedTasks)
        onTaskUpdate(updatedTask)
    }

    const handleDelete = (deletedTask: Task) => {
        const updatedTasks = tasks.filter(task => task.id !== deletedTask.id)
        setTasks(updatedTasks)
    }

    return (
        <div className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h5">Archived Tasks</Typography>
            </Box>
            <Paper className={styles.tasks_container}>
                <div className={styles.task_list}>
                    {userRole.data && tasks.map((task, index) => (
                        task.taskStatus == TaskStatus.ARCHIVED
                        &&
                        <div key={index} className={styles.task_card_wrapper}>
                            <TaskCard
                                boardId={boardId}
                                task={task}
                                onClick={() => {}}
                                onTaskUpdate={handleUpdate}
                                userRole={userRole.data.userRole}
                                onDelete={handleDelete}/>
                        </div>
                    ))}
                </div>
            </Paper>
        </div>
    )
}

export default ArchivedTasksView
