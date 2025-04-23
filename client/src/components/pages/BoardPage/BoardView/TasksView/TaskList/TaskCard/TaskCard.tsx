import { Box, Card, CardActionArea, Modal, Typography } from '@mui/material'
import { Role, Task } from '@/types/types'

import styles from './TaskCard.module.scss'
import React from 'react'
import TaskCardInfoPopup from './TaskCardInfoPopup'
import { FetchResponse } from '@/types/fetch'

type Props = {
    boardId: number,
    task: Task
    onClick: () => void
    onMouseDown: (e: MouseEvent, task: Task) => void
    onTaskUpdate: (t: Task) => void
    userRole: FetchResponse<Role | null>
    onDelete: (t: Task) => void
}

const TaskCard = ({ boardId, onClick, task, onMouseDown, onTaskUpdate, userRole, onDelete }: Props) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);

    const deadlineDisplay = () => {
        if (!task.deadlineEnd) return ""
        console.log(task.deadlineEnd)
        const deadline = new Date(task.deadlineEnd)
        const now = new Date()
        const dateStr = deadline.toLocaleDateString()
        const diffTime = deadline.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
        if (diffDays >= 0) {
            return `Deadline by - ${dateStr} (${diffDays} days left)`
        } else {
            return (
                <>
                    <Box sx={{ color: 'red' }}>
                        Deadline {dateStr} passed ({Math.abs(diffDays)} days late)
                    </Box>
                </>
            )
        }
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
                                {task.assignedUsers.slice(0, 3).map(user => (
                                    <img key={user.id} width={25} height={25} src={user.imageURL ?? 'https://preview.colorkit.co/color/ff0000.png?static=true'} alt="image" />
                                ))}
                            </div>
                        </div>
                        <div className={styles.bottom_row}>
                            {deadlineDisplay()}
                        </div>
                    </div>
                </CardActionArea>
            </Card>
            <TaskCardInfoPopup boardId={boardId} open={open} setOpen={setOpen} task={task} handleUpdate={onTaskUpdate} userRole={userRole} onDelete={onDelete}/>
        </>
    )
}

export default TaskCard
