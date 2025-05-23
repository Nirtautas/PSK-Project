import { Avatar, Box, Card, CardActionArea, Modal, Typography } from '@mui/material'
import { Role, Task, TaskUser } from '@/types/types'

import styles from './TaskCard.module.scss'
import React, { useEffect, useState } from 'react'
import TaskCardInfoPopup from './TaskCardInfoPopup'
import { FetchResponse } from '@/types/fetch'
import DeadlineDisplay from '@/components/shared/DeadlineDisplay'

type Props = {
    boardId: number,
    task: Task
    onClick: () => void
    onMouseDown?: (e: MouseEvent, task: Task) => void
    onTaskUpdate: (t: Task) => void
    userRole: Role
    onDelete: (t: Task) => void
}

const TaskCard = ({ boardId, onClick, task, onMouseDown, onTaskUpdate, userRole, onDelete }: Props) => {

    const [open, setOpen] = useState(false)
    const [currentTask, setCurrentTask] = useState<Task>(task)
    const handleOpen = () => setOpen(true);

    useEffect(() => {
        setCurrentTask(task)
    }, [task])

    const handleUsersChange = (taskUsers: TaskUser[]) => {
        currentTask.assignedUsers = taskUsers
        setCurrentTask(currentTask)
    }

    const handleTaskUpdate = (updatedTask: Task) => {
        updatedTask.assignedUsers = currentTask.assignedUsers
        setCurrentTask(updatedTask)
        onTaskUpdate(updatedTask)
    }
    return (
        <>
            <Card elevation={2} className={styles.task_card} onMouseDown={onMouseDown ? (e) => onMouseDown(e as unknown as MouseEvent, task) : undefined} onClick={handleOpen}>
                <CardActionArea onClick={onClick} className={styles.task_card_clickable}>
                    <div className={styles.task_card_content}>
                        <div className={styles.top_row}>
                            <div className={styles.title_box}>
                                {task.title}:
                            </div>
                            <div className={styles.image_box}>
                                {currentTask.assignedUsers?.slice(0, 3).map(user => (
                                    <Avatar className={styles.avatar} key={user.userName} alt={user.userName} src={user.imageURL}/>
                                ))}
                            </div>
                        </div>
                        <div className={styles.bottom_row}>
                            <DeadlineDisplay deadline={currentTask.deadlineEnd}/>
                        </div>
                    </div>
                </CardActionArea>
            </Card>
            <TaskCardInfoPopup boardId={boardId} open={open} setOpen={setOpen} task={currentTask} handleUpdate={handleTaskUpdate} userRole={userRole} onDelete={onDelete} onUserChange={handleUsersChange}/>
        </>
    )
}

export default TaskCard
