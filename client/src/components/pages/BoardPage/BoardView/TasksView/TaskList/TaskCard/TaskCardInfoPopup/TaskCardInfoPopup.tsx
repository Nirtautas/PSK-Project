import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import React, { use, useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import DeadlineDescriptionView from './DeadlineDescriptionView';
import CommentsView from './CommentsView';
import AssignedUsersView from './AssignedUsersView';
import { Role, Task, TaskStatus, TaskUser } from '@/types/types';
import TaskApi, { UpdateTaskDto } from '@/api/task.api';
import { Comment } from '@/types/types';
import { TextField } from '@mui/material';
import { FetchResponse } from '@/types/fetch';
import TaskOnUserApi from '@/api/taskOnUser.api';

export default function TaskCardInfoPopup({
    boardId,
    open,
    setOpen,
    task,
    handleUpdate,
    userRole,
    onDelete,
    onUserChange
}: {
    boardId: number,
    open: boolean, 
    setOpen: (open: boolean) => void,
    task: Task
    handleUpdate: (t: Task) => void
    userRole: Role
    onDelete: (t: Task) => void
    onUserChange: (u: TaskUser[]) => void
}) {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [wasEdited, setWasEdited] = useState<boolean>(false)
    const [deadline, setDeadline] = useState<Date | null>(task.deadlineEnd)
    const [description, setDescription] = useState<string | null>(task.description)
    const [title, setTitle] = useState<string | null>(task.title)
    
    const updateTask = async (taskToUpdate: Task) => {
        const newTask: UpdateTaskDto = {
            title: title ?? "",
            description: description,
            deadlineEnd: deadline,
            taskStatus: taskToUpdate.taskStatus,
            version: taskToUpdate.version
        }
        const updatedTask = await TaskApi.update(boardId, taskToUpdate.id, newTask)
        
        if (updatedTask.result)
            handleUpdate(updatedTask.result)
    }

    const handleClose = () => {
        setOpen(false)
        setEditMode(false)

        if (wasEdited) {
            updateTask(task)
        }
        setWasEdited(false)
    }

    const handleEdit = () => {
        setEditMode(editMode ? false : true)
        setWasEdited(true)
    }

    const handleDelete = async () => {
        try {
            await TaskApi.delete(boardId, task.id)
            onDelete(task)
            handleClose()
        } catch (error) {
            console.log(error)
        }
    }

    const handleArchive = () => {
        const newStatus = task.taskStatus !== TaskStatus.ARCHIVED ? TaskStatus.ARCHIVED : TaskStatus.PENDING;
        const newTask = { ...task, taskStatus: newStatus };
        updateTask(newTask)
        setOpen(false)
    }
    
    //TODO: move this to a separate file
    const modalContainer = {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '70%',
        height: '100%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        overflowY: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    };
    const topRow = {
        width: '100%', 
        display: 'flex', 
        flexDirection: 'row', 
        padding: 2, 
        height: 100, 
        alignItems: 'center'
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalContainer}>
                <Box sx={topRow}>
                    {!editMode && <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ flexGrow: 1 }}>{title}</Typography>}
                    {editMode && 
                        <TextField
                            sx={{ flexGrow: 1 }}
                            variant="outlined" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    }
                    {userRole !== Role.VIEWER && (
                        <>
                            <Button variant="outlined" onClick={handleArchive} sx={{ mt: 2, height: 1, ml: 1 }}>
                                {task.taskStatus === TaskStatus.ARCHIVED ? 'Unarchive' : 'Archive'}
                            </Button>
                            {
                                task.taskStatus !== TaskStatus.ARCHIVED &&
                                <Button variant="outlined" onClick={handleEdit} sx={{ mt: 2, height: 1, ml: 1 }}>
                                    Edit
                                </Button>
                            }
                            <Button variant="outlined" onClick={handleDelete} sx={{ mt: 2, height: 1, ml: 1 }}>
                                Delete
                            </Button>
                        </>
                    )}
                    <Button variant="outlined" onClick={handleClose} sx={{ mt: 2, height: 1, ml: 1 }}>
                        Close
                    </Button>
                </Box>
                <Divider />
                <Box sx={{ width: '100%', height: '100%', padding: 1}}>
                    <Grid container spacing={2} sx={{width: '100%', height: '100%', padding: 1}} >
                        <Grid size={8} sx={{height: '100%'}}>
                            <Stack spacing={2} sx={{height: '100%'}}>
                                <DeadlineDescriptionView
                                    editMode={editMode}
                                    deadline={deadline}
                                    setDeadline={setDeadline}
                                    description={description}
                                    setDescription={setDescription}
                                />
                                <CommentsView taskId={task.id} boardId={boardId}/>
                            </Stack>
                        </Grid>
                        <Grid size={0.1}>
                            <Divider orientation="vertical" />
                        </Grid>
                        <Grid size={3}>
                            <AssignedUsersView users={task.assignedUsers || []} boardId={boardId} taskId={task.id} onUserChange={onUserChange} editMode={editMode}/>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    )
}