import { Box, Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TaskApi, { CreateTaskDto } from "@/api/task.api";
import SelectUsersField from "./SelectUsersField";
import dayjs from "dayjs";
import { useState, FormEvent } from "react";
import { BoardUser, Task, TaskStatus } from "@/types/types";
import TaskOnUserApi from "@/api/taskOnUser.api";

type Props = {
    handleClose: () => void
    boardId: number
    onCreate: (t: Task) => void
}

const CreateTaskForm = ({ handleClose, boardId, onCreate }: Props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<BoardUser[]>([]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        try {
            const newTask = {
                title,
                description: description || null,
                taskStatus: TaskStatus.PENDING,
                deadlineEnd: deadline ? deadline.toDate() : null
            }
            
            const response = await TaskApi.create(newTask as CreateTaskDto, boardId)
            if (response.result) {
                const userIds = selectedUsers.map(user => user.id)
                await TaskOnUserApi.linkTaskUser(boardId, response.result.id, userIds)
                onCreate(response.result)
            }
            handleClose()
        } catch (error) {
            console.error('Task creation failed:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField 
                    required 
                    label="Title" 
                    variant="standard" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        label="Deadline" 
                        value={deadline}
                        onChange={(date) => setDeadline(date)}
                    />
                </LocalizationProvider>
                <TextField 
                    label="Description" 
                    variant="standard" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <SelectUsersField 
                    setSelectedUsers={setSelectedUsers}
                    boardId={boardId}
                />
                <Button type="submit" variant="contained">
                    Create Task
                </Button>
            </Box>
        </form>
    )
}

export default CreateTaskForm
