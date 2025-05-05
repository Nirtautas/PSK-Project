import { Box, Card, CardActionArea, Modal, Typography } from '@mui/material'
import { Role, Task, TaskUser } from '@/types/types'

import styles from './TaskCard.module.scss'
import React, { useState } from 'react'
import TaskCardInfoPopup from './TaskCardInfoPopup'
import { FetchResponse } from '@/types/fetch'
import DeadlineDisplay from './DeadlineDisplay'

type Props = {
    boardId: number,
    task: Task
    onClick: () => void
    onMouseDown: (e: MouseEvent, task: Task) => void
    onTaskUpdate: (t: Task) => void
    userRole: Role
    onDelete: (t: Task) => void
}

const TaskCard = ({ boardId, onClick, task, onMouseDown, onTaskUpdate, userRole, onDelete }: Props) => {

    const [open, setOpen] = useState(false)
    const [currentTask, setCurrentTask] = useState<Task>(task)
    const handleOpen = () => setOpen(true);

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
            <Card elevation={2} className={styles.task_card} onMouseDown={(e) => onMouseDown(e as unknown as MouseEvent, task)} onClick={handleOpen}>
                <CardActionArea onClick={onClick} className={styles.task_card_clickable}>
                    <div className={styles.task_card_content}>
                        <div className={styles.top_row}>
                            <div className={styles.title_box}>
                                {task.title}:
                            </div>
                            <div className={styles.image_box}>
                                {currentTask.assignedUsers?.slice(0, 3).map(user => (
                                    <img key={user.id} width={25} height={25} src={user.imageURL ?? 'https://preview.colorkit.co/color/ff0000.png?static=true'} alt="image" />
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
